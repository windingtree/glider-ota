curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"type":"payment_intent.succeeded", "data": {"object": {"metadata": {"confirmedOfferId" : "d46c802b-cf1f-4d37-985c-c74fe2cf76f0"}}}}' \
  https://staging.glider.travel/api/order/webhook