# Generar archivos de audio de voz real (WAV) con Microsoft Helena (es-ES)
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Seleccionar voz en español
$synth.SelectVoice("Microsoft Helena Desktop")
$synth.Rate = 0  # Velocidad natural (rango -10 a 10)

$outDir = "c:\Users\Bogota\Downloads\Mineria-de-Datos-main (1)\Mineria-de-Datos-main\frontend\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

# 1. K-Means
$textKMeans = "Iniciando demostración del algoritmo de agrupamiento K-Means. En la primera fase, proyectamos la nube de observaciones morfológicas del conjunto de datos en el plano bidimensional. A continuación, se inicializan estocásticamente tres centroides identificados como mu 1, mu 2 y mu 3. En la fase de asignación de Voronoi, el algoritmo calcula la distancia euclidiana entre cada punto y los centroides, asignando cada muestra a su centroide más próximo. Posteriormente, se recalculan las medias aritméticas y los centroides se desplazan hacia el centro de masa de cada grupo. La inercia intra-clúster desciende hasta alcanzar la convergencia de estado estable con 88 por ciento de varianza explicada."

$synth.SetOutputToWaveFile("$outDir\kmeans_narration.wav")
$synth.Speak($textKMeans)
Write-Output "Generado: kmeans_narration.wav"

# 2. Árboles CART
$textTree = "Visualización del algoritmo CART de clasificación supervisada por partición binaria recursiva. Partimos del espacio completo de características con una impureza de Gini inicial de cero punto seiscientos sesenta y siete. El algoritmo evalúa exhaustivamente todos los umbrales continuos y selecciona la regla óptima: longitud de pétalo menor o igual a dos punto cuarenta y cinco. Esta primera división aísla de manera completamente pura la clase Setosa con un Gini de cero absoluto. Seguidamente, el subconjunto restante se particiona mediante ancho de pétalo menor a uno punto setenta y cinco, separando Versicolor y Virginica con noventa y seis por ciento de exactitud."

$synth.SetOutputToWaveFile("$outDir\cart_tree_narration.wav")
$synth.Speak($textTree)
Write-Output "Generado: cart_tree_narration.wav"

# 3. Redes Neuronales
$textNeural = "Demostración de Red Neuronal Perceptrón Multicapa con propagación hacia adelante y retropropagación. Cuatro variables de entrada alimentan la red y transmiten pulsos de activación a través de la matriz sináptica ponderada W. Cada neurona oculta integra las señales ponderadas con su sesgo y evalúa la función de activación no lineal ReLU. En la capa de salida, la función Softmax calcula la probabilidad de pertenencia a cada clase. Finalmente, la onda de retropropagación evalúa el gradiente de la función de pérdida y actualiza los pesos sinápticos mediante descenso de gradiente estocástico."

$synth.SetOutputToWaveFile("$outDir\neural_net_narration.wav")
$synth.Speak($textNeural)
Write-Output "Generado: neural_net_narration.wav"

$synth.Dispose()
Write-Output "Todas las narraciones de voz han sido generadas exitosamente."
