import React, { useContext } from 'react'
import './cartTotal.css'
import { ShopContext } from '../../context/shopContext'
import Title from '../title/Title'

export default function CartTotal() {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)
    
    // Fonction pour formater proprement les montants
    const formatAmount = (amount) => {
        // Si amount est NaN ou non défini, retourner 0
        if (isNaN(amount) || amount === null || amount === undefined) {
            return `0.00 ${currency}`
        }
        // Formater avec 2 décimales
        return `${parseFloat(amount).toFixed(2)} ${currency}`
    }

    // Calcul des totaux avec vérifications
    const subtotal = getCartAmount() || 0
    const total = subtotal === 0 ? 0 : subtotal + (delivery_fee || 0)

    return (
        <div className="cart-total-container">
            <div className="cart-total-title">
                <Title text1={'TOTAL'} text2={"D'ACHATS"} />
            </div>

            <div className="cart-total-details">
                <div className="cart-total-row">
                    <p>SousTotal</p>
                    <p>{formatAmount(subtotal)}</p>
                </div>
                <hr />
                <div className="cart-total-row">
                    <p>Frais De Livraison</p>
                    <p>{formatAmount(delivery_fee)}</p>
                </div>
                <hr />
                <div className="cart-total-row">
                    <b>Total</b>
                    <b>{formatAmount(total)}</b>
                </div>
            </div>
        </div>
    )
}