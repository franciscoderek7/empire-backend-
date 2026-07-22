from src.offers.models.product import Product

p=Product(
"AI Website Package",
"Service",
499,
"Francisco Holdings Inc."
)

assert p.price==499

print("Offer engine test passed")
