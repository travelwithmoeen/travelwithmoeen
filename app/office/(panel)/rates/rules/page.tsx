import { savedByCells, savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { loadRateDesk } from "@/components/office/rates/load-rates";
import { PricingRulesForm } from "@/components/office/rates/PricingRulesForm";
import { RateTable } from "@/components/office/rates/RateTable";
import { Alert } from "@/components/office/ui/Alert";
import { getSavedBy } from "@/lib/http/office-session";

// BR-87 and BR-88: the pricing rules and the dinner and lunch rates for each grade.
export default async function RatesRulesPage() {
  const [desk, rulesSaved, mealsSaved] = await Promise.all([loadRateDesk(), getSavedBy("pricing_rule"), getSavedBy("meal_rate")]);
  const now = requestTime();
  return (
    <>
      {desk.rules ? (
        <PricingRulesForm rules={desk.rules} savedBy={savedByText(rulesSaved[""], now)} />
      ) : (
        <Alert tone="warning" title="The pricing rules are not stored yet. Run drizzle/0004_pricing_rules.sql." />
      )}
      {/* Its own section, so the table's save bar stays with the table and not over the rules. */}
      <section className="stack" aria-label="Meal rates">
        <Alert tone="info" title="Meal rates">
          Per adult and child. Dinner is added for each night and lunch for each day. Infants are not counted.
        </Alert>
        <RateTable
          kind="meal_rate"
          noun="meal rates"
          toolbar={false}
          columns={[
            { key: "grade", label: "Grade", type: "text" },
            { key: "dinner", label: "Dinner, per night", type: "money" },
            { key: "lunch", label: "Lunch, per day", type: "money" },
          ]}
          rows={desk.meals.map((row) => ({ id: row.id, values: { grade: row.grade, dinner: row.dinner, lunch: row.lunch } }))}
          savedBy={savedByCells(mealsSaved, now)}
          nameKeys={["grade"]}
        />
      </section>
    </>
  );
}
