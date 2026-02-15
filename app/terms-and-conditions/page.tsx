export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 mb-10">
          Travel with Moeen
        </p>

        <div className="space-y-10 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              1. Trip Cancellations & Changes
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Minimum Capacity:</strong> Our group tours require a
                minimum of 10–12 participants. If a trip is cancelled by Travel
                with Moeen due to low registration, members are entitled to a
                100% refund or a credit transfer to a future trip.
              </li>
              <li>
                <strong>Company Rights:</strong> Travel with Moeen reserves the
                right to cancel a booking or amend these Terms & Conditions at
                any time without prior notice.
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              2. Logistics & Punctuality
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Reporting Time:</strong> Members must report to the
                departure point 1 hour before the scheduled time.
              </li>
              <li>
                <strong>Late Arrivals:</strong> The tour bus will depart exactly
                15 minutes after the scheduled time. No responsibility will be
                taken for missed departures, and no refunds or extra expenses
                will be covered.
              </li>
              <li>
                <strong>Tickets & Fare:</strong> Bus, Air, or Train tickets are
                subject to availability. Prices are based on current fuel rates.
                Any significant hike in fuel prices before or during the trip
                may result in a package price adjustment.
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              3. Accommodation & Rooming
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Standard Sharing:</strong> Rooms are provided on a
                (3-person) sharing basis, which includes mattresses.
              </li>
              <li>
                <strong>2-Person Sharing:</strong> Limited to married couples,
                family members, or two individuals of the same gender (2 Males /
                2 Females).
              </li>
              <li>
                <strong>Availability:</strong> Mentioned hotels are subject to
                availability, especially during peak seasons. If unavailable, an
                equivalent standard accommodation will be provided.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              4. Code of Conduct & Ethics
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Behavior:</strong> Members must behave respectfully
                toward fellow travelers and the team leader.
              </li>
              <li>
                <strong>Strict Prohibitions:</strong> Personal weapons and drugs
                are strictly prohibited.
              </li>
              <li>
                <strong>Consequences:</strong> Failure to follow the Team
                Leader’s instructions or breach of ethical conduct may result in
                immediate cancellation of your trip without a refund.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              5. Safety & Liability
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Responsibility:</strong> Travel with Moeen is
                not responsible for personal injuries, accidents, or the
                loss/theft of valuable items.
              </li>
              <li>
                <strong>Environmental Care:</strong> Zero tolerance for
                littering. Violators may be fined.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              6. Refund & Force Majeure Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Exits During Trip:</strong> No refunds will be issued if
                a member chooses to leave the tour once the journey has begun.
              </li>
              <li>
                <strong>Unforeseen Circumstances:</strong> No refunds shall be
                made in case of natural disasters or “Acts of God” (heavy rain,
                landslides, road closures) or mechanical issues (engine failure,
                flat tires).
              </li>
              <li>
                <strong>Exclusions:</strong> Entrance tickets for forts,
                museums, or national parks are not included unless explicitly
                stated.
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
