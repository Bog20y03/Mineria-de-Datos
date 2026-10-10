# Etapa 2: Aplicación y Benchmark Comparativo de Técnicas
## Descripción de la Fase
Evaluación comparativa de tres algoritmos de clasificación supervisada implementados de forma reproducible en R (`02_benchmark_proyecto.R`).
## Dataset y Partición Experimental
- **Dataset:** Muestra didáctica de 500 registros con estructura inspirada en UCI #697; no verificada como submuestra.
- **Población Total:** 500 registros con 5 casos de abandono (1.0% de prevalencia).
- **Partición:** 70% entrenamiento (350 registros) y 30% prueba independiente (150 registros con 3 positivos, 2.0%).
## Resultados del Benchmark (`benchmark_resultados.csv`)
| Modelo | Exactitud en Prueba | Sensibilidad | Baseline Mayoritaria | Supera Baseline |
| :--- | :---: | :---: | :---: | :---: |
| Regresión Logística | 98.00% | 0% | 98.00% | No (Iguala) |
| Árbol CART | 98.00% | 0% | 98.00% | No (Iguala) |
| Red Neuronal (MLP) | 98.00% | 0% | 98.00% | No (Iguala) |
## Diagnóstico Técnico
Los tres modelos igualan el baseline trivial de la clase mayoritaria (98.00%) debido al desbalance extremo de la muestra didáctica, clasificando todas las observaciones como no abandono.
