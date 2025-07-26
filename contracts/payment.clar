;; --- payment.clar ---
;; A simple smart contract to handle payments for an e-commerce store.

;; Define a constant for the store owner's wallet address.
;; IMPORTANT: Replace this with YOUR Stacks testnet address!
(define-constant store-owner 'ST3HMW7MD2GYDBPZWBGJSNREGZW0EAM00KVJ9PT2T)

;; Define a custom error code for when a transfer fails.
(define-constant ERR_TRANSFER_FAILED (err u100))

;; --- Public Functions ---

;; @desc Pays for an order by transferring STX from the user to the store owner.
;; @param total-amount: The total cost of the order as an unsigned integer (uint).
;; @returns (response bool uint) - ok true on success, or an error on failure.
(define-public (pay-for-order (total-amount uint))
  (begin
    ;; Attempt to transfer the STX.
    ;; stx-transfer? takes three arguments:
    ;; 1. The amount to transfer.
    ;; 2. The sender (tx-sender is a keyword for the user calling the function).
    ;; 3. The recipient (our store-owner constant).
    (match (stx-transfer? total-amount tx-sender store-owner)
      
      ;; If the transfer is successful, this block runs.
      success (ok true)
      
      ;; If the transfer fails for any reason, this block runs.
      error (err ERR_TRANSFER_FAILED)
    )
  )
)
