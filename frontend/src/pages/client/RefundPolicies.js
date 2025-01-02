import React from 'react';
import '../../assets/css/Policies.css';

const RefundPolicies = () => {
    return (
        <div className="policies-container">
            <div className="policies-card">
                <section className="policies-section">
                    <h3 className="policies-title">Refund Description</h3>
                    <p className="policies-paragraph">
                        A refund is the repayment to the purchaser of all or a portion of a fare, rate or charge for unused carriage or service.
                    </p>
                    <h4 className="policies-subtitle">Non-refundable Tickets</h4>
                    <ul className="policies-list">
                        <li>No part of the fare and surcharges (YQ/YR) will be refunded for non-refundable tickets</li>
                        <li>Unutilized coupon's flown based taxes are refundable</li>
                        <li>If re-issued to a refundable fare, original YQ/YR and base fare remain non-refundable</li>
                    </ul>
                </section>

                <section className="policies-section">
                    <h3 className="policies-title">Refund Validity</h3>
                    <ul className="policies-list">
                        <li>Fully unused ticket: 12 months from date of issue</li>
                        <li>Partially used ticket: 12 months from the first uplift date</li>
                    </ul>
                    <h4 className="policies-subtitle">Extended Validity Cases</h4>
                    <ul className="policies-list">
                        <li>Local law/regulatory requirements override standard policy</li>
                        <li>Death cases: Refund to legal heirs with valid documentation</li>
                    </ul>
                </section>

                <section className="policies-section">
                    <h3 className="policies-title">Special Refund Circumstances</h3>
                    <h4 className="policies-subtitle">Eligible Situations</h4>
                    <ul className="policies-list">
                        <li>Flight delays with self-arranged alternative travel</li>
                        <li>Schedule changes or aircraft modifications</li>
                        <li>Terminal illness (with valid medical certificate)</li>
                        <li>Force Majeure events (natural disasters, political unrest)</li>
                        <li>Visa denial for Doha entry</li>
                        <li>System/printing related errors</li>
                        <li>Blacklisted passenger cases</li>
                    </ul>
                </section>

                <section className="policies-section">
                    <h3 className="policies-title">Refund Restrictions by Country</h3>
                    <p className="policies-paragraph">
                        The following countries have restrictions on refunds outside their point of sale:
                    </p>
                    <ul className="policies-list">
                        <li>Algeria, India, Greece, France/Benelux</li>
                        <li>Brazil, Morocco, Nigeria, Tunisia</li>
                        <li>Iran, Malawi, Eritrea, Sudan</li>
                    </ul>
                </section>

                <section className="policies-section">
                    <h3 className="policies-title">General Cancellation Conditions</h3>
                    <ul className="policies-list">
                        <li>Non-refundable fares: No refund of Fare + YQ/YR</li>
                        <li>Child and infant occupying seats: Same penalties as adult passengers</li>
                        <li>No-show scenarios: Higher fee between no-show or cancellation applies</li>
                        <li>Combined fares: Most restrictive rules apply</li>
                        <li>Invalid travel documents: All cancellation and no-show fees apply</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicies;