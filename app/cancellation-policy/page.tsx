export default function CancellationPolicyPage() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-gray-600 mb-10">
          Travel with Moeen
        </p>

        <div className="space-y-12 text-gray-700 leading-relaxed">

          {/* A Service Charges */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              A. Service Charges (Private Tours)
            </h2>
            <p className="mb-4">
              In the event of any cancellation, the following Travel with Moeen
              service charges apply (in addition to hotel and transport penalties):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cash Refund:</strong> 10% of the total package price
                will be deducted.
              </li>
              <li>
                <strong>Credit Adjustment:</strong> 5% deduction if the balance
                is adjusted toward a new booking within the next 3 months.
                <span className="block text-sm text-gray-600 mt-1">
                  (New package prices may vary based on peak/off-season rates.)
                </span>
              </li>
            </ul>
          </section>

          {/* B Hotel Cancellations */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              B. Hotel Cancellations
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Over 2 weeks’ notice: 100% Refund.</li>
              <li>1 week notice: 75% Refund.</li>
              <li>7 days to 24 hours’ notice: 60% Refund.</li>
              <li>
                Within 24 hours (due to flight/road issues): 60% refund or
                adjustment within the same calendar year.
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Note: Some hotels may have stricter cancellation policies. Please
              confirm with your agent whether your selected hotel allows refunds
              or only date adjustments.
            </p>
          </section>

          {/* C Transport Cancellations */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              C. Transport Cancellations
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Over 1 week notice: 100% Refund.</li>
              <li>
                7 days to 24 hours’ notice: Deduction of 1-day car rental.
              </li>
              <li>
                Within 24 hours: Deduction of a minimum of 2-days car rental.
              </li>
            </ul>
          </section>

          {/* D Group Tours */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              D. Group / Fixed Departure Tours
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>15+ days before trip: 90% Refund.</li>
              <li>7–14 days before trip: 50% Refund.</li>
              <li>5 days before trip: 25% Refund.</li>
              <li>Less than 5 days: 0% Refund.</li>
              <li>
                <strong>Unused Services:</strong> No refunds are provided for
                non-utilization of any service (jeep rides, day visits, etc.)
                once the trip is underway.
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
