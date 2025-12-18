// @ts-nocheck
/* eslint-disable */
import { db } from "@ascendos/database";

/**
 * Script de backfill pour initialiser les dates de trial
 * pour les organisations existantes avant la migration billing
 *
 * Exécuter avec: pnpm exec tsx scripts/backfill-trial-dates.ts
 */

async function backfillTrialDates() {
  console.log("Starting backfill of trial dates for existing organizations...\n");

  try {
    // Récupérer toutes les organisations avec plan TRIAL sans trialEndsAt
    const trialOrgs = await db.organization.findMany({
      where: {
        plan: "TRIAL",
        trialEndsAt: null,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    console.log(`Found ${trialOrgs.length} TRIAL organizations without trialEndsAt\n`);

    if (trialOrgs.length === 0) {
      console.log("No organizations to backfill. Exiting.");
      return;
    }

    let updated = 0;
    let expired = 0;

    for (const org of trialOrgs) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Si l'organisation a été créée il y a plus de 7 jours, le trial est expiré
      const isExpired = org.createdAt < sevenDaysAgo;

      // Calculer trialEndsAt
      // - Si créé il y a < 7 jours : createdAt + 7 jours
      // - Si créé il y a > 7 jours : NOW (expiré immédiatement)
      const trialEndsAt = isExpired
        ? new Date() // Trial expiré maintenant
        : new Date(org.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 jours depuis création

      await db.organization.update({
        where: { id: org.id },
        data: {
          trialEndsAt,
          trialGenerations: 0,
        },
      });

      if (isExpired) {
        expired++;
        console.log(`✓ ${org.name} (ID: ${org.id}) - Trial EXPIRED (created ${org.createdAt.toLocaleDateString()})`);
      } else {
        updated++;
        const daysRemaining = Math.ceil(
          (trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        console.log(`✓ ${org.name} (ID: ${org.id}) - Trial ends in ${daysRemaining} days (${trialEndsAt.toLocaleDateString()})`);
      }
    }

    console.log(`\n✅ Backfill complete!`);
    console.log(`   - ${updated} organizations with active trials`);
    console.log(`   - ${expired} organizations with expired trials`);
    console.log(`   - Total: ${updated + expired} organizations updated`);

  } catch (error) {
    console.error("❌ Error during backfill:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Exécuter le script
backfillTrialDates()
  .then(() => {
    console.log("\n🎉 Script finished successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
