export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-10">
          Travel with Moeen
        </p>

        <div className="space-y-12 text-gray-700 leading-relaxed">

          {/* Private & Customized Tours */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Private & Customized Tours
            </h2>

            {/* 1 Payment & Pricing */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                1. Payment & Pricing
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Net Pricing:</strong> All quoted prices are net
                  amounts payable to Travel with Moeen and are exclusive of
                  taxes. Tax can be added upon request.
                </li>
                <li>
                  <strong>Payment Schedule:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>50% deposit required at confirmation.</li>
                    <li>Remaining 50% must be cleared before departure.</li>
                    <li>Full payment must be received before the trip begins.</li>
                  </ul>
                </li>
                <li>
                  <strong>Methods:</strong> We accept Cash, Bank Transfer, and
                  Cheque.
                </li>
                <li>
                  <strong>Fuel Surcharge:</strong> Any drastic increase in fuel
                  prices before the tour start date may result in a cost
                  adjustment.
                </li>
              </ul>
            </div>

            {/* 2 Accommodation & Documents */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                2. Accommodation & Documents
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Rooming:</strong> For triple or quad sharing, rooms
                  will be provided with a Master/Triple bed plus additional
                  mattresses.
                </li>
                <li>
                  <strong>Identification:</strong> Every member must carry their
                  original CNIC (or Passport/Visa for foreign nationals).
                </li>
                <li>
                  <strong>Liability:</strong> Travel with Moeen is not
                  responsible for personal injuries, accidents, or loss of
                  valuable items.
                </li>
              </ul>
            </div>
          </section>

          {/* Refund & Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Refund & Cancellation Policy
            </h2>

            {/* A Service Charges */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                A. Service Charges (Private Tours)
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cash Refund:</strong> 10% of the total package price
                  is deducted.
                </li>
                <li>
                  <strong>Credit Adjustment:</strong> 5% deduction if adjusted
                  toward a new booking within 3 months. (New package prices may
                  vary based on peak/off-season rates.)
                </li>
              </ul>
            </div>

            {/* B Hotel Cancellations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                B. Hotel Cancellations
              </h3>
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
                Note: Some hotels have stricter policies. Please confirm with
                your agent if your specific hotel allows refunds or only date
                adjustments.
              </p>
            </div>

            {/* C Transport Cancellations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                C. Transport Cancellations
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Over 1 week notice: 100% Refund.</li>
                <li>
                  7 days to 24 hours’ notice: Deduction of 1-day car rental.
                </li>
                <li>
                  Within 24 hours: Deduction of minimum 2-days car rental.
                </li>
              </ul>
            </div>

            {/* D Group Tours */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                D. Group / Fixed Departure Tours
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>15+ days before trip: 90% Refund.</li>
                <li>7–14 days before trip: 50% Refund.</li>
                <li>5 days before trip: 25% Refund.</li>
                <li>Less than 5 days: 0% Refund.</li>
                <li>
                  <strong>Unused Services:</strong> No refunds are provided for
                  non-utilization of services once the trip is underway.
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
