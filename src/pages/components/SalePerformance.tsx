import React from 'react'
import DateSelector from './DateSelector'

export default function SalePerformance() {
    return (
        <div>
            <div className="cardMain">
                <div className="headerContent">
                    <h3>Sale By Shop</h3>
                    <DateSelector picker="month" />
                </div>
            </div>
        </div>
    )
}
