from src.knowledge.models.entity import Entity
from src.knowledge.services.graph import KnowledgeGraph

g=KnowledgeGraph()

g.add_entity(
Entity(
"PrimeDox AI",
"system"
)
)

assert g.summary()["entities"]==1

print("Knowledge graph test passed")
