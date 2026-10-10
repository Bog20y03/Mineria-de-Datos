# Tema 04: Redes Neuronales Artificiales
## Concepto
Las redes neuronales artificiales (ANN) son modelos conexionistas inspirados en las estructuras sinápticas biológicas, conformados por capas de nodos interconectados con pesos ajustables.
## Elementos Fundamentales
- **Neurona Artificial:** Realiza una combinación lineal ponderada $z = \sum w_i x_i + b$ y aplica una función de activación no lineal.
- **Capas:** Capa de entrada, capas ocultas y capa de salida.
- **Funciones de Activación:** Sigmoide logística $\sigma(z) = \frac{1}{1 + e^{-z}}$, ReLU, Tanh.
- **Entrenamiento:** Algoritmo de Retropropagación (Backpropagation) y Descenso de Gradiente estocástico.
- **Evaluación:** Entropía cruzada, regularización de pesos (weight decay) y exactitud de predicción.
