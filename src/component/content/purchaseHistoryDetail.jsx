import React from 'react'
import styles from './purchaseHistorydetail.module.css'
const PurchaseHistoryDetail = ({ detailData }) => {
    console.log('detaildata', detailData)
    const detailRows = detailData.trainer_detail_list.map((trainer, index) => {
        const { trainer_name, payment_type, create_time, hour_purchased, amount } = trainer.fields
        return (
            <tr key={index}>
                <td>{trainer_name.stringValue}</td>
                <td>{new Date(create_time.timestampValue).toLocaleDateString()}</td>
                <td>{payment_type.stringValue}</td>
                <td>{hour_purchased.integerValue}</td>
                <td>£{amount.doubleValue}</td>
            </tr>
        )
    })
    const summary = (
        <tr>
            <td colSpan={3}>Total</td>
            <td>{detailData.trainer_total_purchase_hours}</td>
            <td>£{detailData.trainer_total_amount}</td>
        </tr>
    )
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Payment Type</th>
                    <th>Hour Purchased</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody> {detailRows} </tbody>
            <tfoot> {summary} </tfoot>
        </table>
    )
}

export default PurchaseHistoryDetail
