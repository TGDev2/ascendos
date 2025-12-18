import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@ascendos/database";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Handle events
  const eventType = evt.type;

  switch (eventType) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const primaryEmail = email_addresses.find((e) => e.id === evt.data.primary_email_address_id);

      if (!primaryEmail) {
        return new Response("Error: No primary email", { status: 400 });
      }

      // Create organization for new user
      const org = await db.organization.create({
        data: {
          name: `${first_name || "User"}'s Organization`,
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
          trialGenerations: 0,
        },
      });

      // Create user
      await db.user.create({
        data: {
          clerkId: id,
          email: primaryEmail.email_address,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || null,
          organizationId: org.id,
          role: "OWNER",
        },
      });

      break;
    }

    case "user.updated": {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const primaryEmail = email_addresses.find((e) => e.id === evt.data.primary_email_address_id);

      if (!primaryEmail) {
        return new Response("Error: No primary email", { status: 400 });
      }

      await db.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail.email_address,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || null,
        },
      });

      break;
    }

    case "user.deleted": {
      const { id } = evt.data;

      if (!id) {
        return new Response("Error: No user ID", { status: 400 });
      }

      await db.user.delete({
        where: { clerkId: id },
      });

      break;
    }

    case "organization.created": {
      const { id, name } = evt.data;

      await db.organization.create({
        data: {
          id,
          name,
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
          trialGenerations: 0,
        },
      });

      break;
    }

    case "organization.updated": {
      const { id, name } = evt.data;

      await db.organization.update({
        where: { id },
        data: { name },
      });

      break;
    }

    case "organization.deleted": {
      const { id } = evt.data;

      if (!id) {
        return new Response("Error: No organization ID", { status: 400 });
      }

      await db.organization.delete({
        where: { id },
      });

      break;
    }

    case "organizationMembership.created": {
      const { organization, public_user_data } = evt.data;

      if (!organization?.id || !public_user_data?.user_id) {
        return new Response("Error: Missing data", { status: 400 });
      }

      await db.user.update({
        where: { clerkId: public_user_data.user_id },
        data: {
          organizationId: organization.id,
          role: evt.data.role === "org:admin" ? "ADMIN" : "MEMBER",
        },
      });

      break;
    }

    case "organizationMembership.updated": {
      const { public_user_data, role } = evt.data;

      if (!public_user_data?.user_id) {
        return new Response("Error: Missing user ID", { status: 400 });
      }

      await db.user.update({
        where: { clerkId: public_user_data.user_id },
        data: {
          role: role === "org:admin" ? "ADMIN" : "MEMBER",
        },
      });

      break;
    }

    case "organizationMembership.deleted": {
      const { public_user_data } = evt.data;

      if (!public_user_data?.user_id) {
        return new Response("Error: Missing user ID", { status: 400 });
      }

      // When removed from org, delete user or handle accordingly
      await db.user.delete({
        where: { clerkId: public_user_data.user_id },
      });

      break;
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
