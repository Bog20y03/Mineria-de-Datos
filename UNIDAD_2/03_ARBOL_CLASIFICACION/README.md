# Tema 03: Árboles de Clasificación
## Concepto y Funcionamiento
Los árboles de clasificación dividen iterativamente el espacio de atributos mediante particiones ortogonales para maximizar la pureza de las clases hijas.
## Criterios de División
- **Índice de Gini:** $Gini = 1 - \sum p_i^2$
- **Entropía:** $H = -\sum p_i \log_2(p_i)$
## Fases de Construcción
1. Crecimiento recursivo codicioso.
2. Criterio de parada (min split, min bucket).
3. Poda por complejidad de coste ($cp$).
4. Evaluación con matriz de confusión y curvas de calibración.
