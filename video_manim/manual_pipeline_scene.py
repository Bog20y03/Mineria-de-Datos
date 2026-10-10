from manim import *

COLOR_BG = "#0B0F17"
COLOR_TERRACOTTA = "#EA580C"
COLOR_BLUE = "#38BDF8"
COLOR_EMERALD = "#10B981"
COLOR_MUTED = "#64748B"
COLOR_INK = "#F8FAFC"
COLOR_AMBER = "#F59E0B"

class ManualPipelineAnimation(Scene):
    def construct(self):
        self.camera.background_color = COLOR_BG

        # Título
        title = Text("Manual de Instrucciones: La Máquina de Minería", font_size=28, color=COLOR_TERRACOTTA)
        subtitle = Text("Flujo Curricular Riguroso de 6 Estaciones de Conocimiento", font_size=16, color=COLOR_MUTED)
        header = VGroup(title, subtitle).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        header.to_corner(UL, buff=0.4)

        self.play(FadeIn(header, shift=UP * 0.2), run_time=1)

        # 6 Estaciones en 2 filas organizadas
        # Fila 1: Estaciones 1, 2, 3
        # Fila 2: Estaciones 4, 5, 6
        stages_data = [
            ("1. Búsqueda", "Ecuaciones Booleanas (Scopus/IEEE)", COLOR_BLUE, [-3.8, 0.8, 0]),
            ("2. Biblioteca", "127 Artículos con DOI Real", COLOR_AMBER, [0, 0.8, 0]),
            ("3. Laboratorio", "26 Datasets + R v4.4.1", COLOR_TERRACOTTA, [3.8, 0.8, 0]),
            ("4. Resultados", "Gráficos PNG + Métricas", COLOR_BLUE, [3.8, -1.6, 0]),
            ("5. LaTeX", "26 Manuscritos .tex Compilados", COLOR_AMBER, [0, -1.6, 0]),
            ("6. Sustentación", "Conclusiones + Beamer 16:9", COLOR_EMERALD, [-3.8, -1.6, 0]),
        ]

        boxes = []
        for name, sub, col, pos in stages_data:
            box = RoundedRectangle(corner_radius=0.15, height=1.1, width=3.4, color=col, fill_color="#131B26", fill_opacity=0.95, stroke_width=2)
            t1 = Text(name, font_size=16, color=col, weight=BOLD)
            t2 = Text(sub, font_size=11, color=COLOR_INK)
            grp = VGroup(box, VGroup(t1, t2).arrange(DOWN, buff=0.1)).move_to(pos)
            boxes.append(grp)

        # Animación secuencial de estaciones y flechas
        # Flecha 1 -> 2
        a1 = Arrow(boxes[0].get_right(), boxes[1].get_left(), buff=0.15, color=COLOR_MUTED, stroke_width=2.5)
        # Flecha 2 -> 3
        a2 = Arrow(boxes[1].get_right(), boxes[2].get_left(), buff=0.15, color=COLOR_MUTED, stroke_width=2.5)
        # Flecha 3 -> 4 (hacia abajo)
        a3 = Arrow(boxes[2].get_bottom(), boxes[3].get_top(), buff=0.15, color=COLOR_MUTED, stroke_width=2.5)
        # Flecha 4 -> 5 (hacia la izquierda)
        a4 = Arrow(boxes[3].get_left(), boxes[4].get_right(), buff=0.15, color=COLOR_MUTED, stroke_width=2.5)
        # Flecha 5 -> 6 (hacia la izquierda)
        a5 = Arrow(boxes[4].get_left(), boxes[5].get_right(), buff=0.15, color=COLOR_MUTED, stroke_width=2.5)

        # Mostrar estaciones
        self.play(FadeIn(boxes[0]), run_time=0.6)
        self.play(Create(a1), FadeIn(boxes[1]), run_time=0.6)
        self.play(Create(a2), FadeIn(boxes[2]), Flash(boxes[2], color=COLOR_TERRACOTTA), run_time=0.8)
        self.play(Create(a3), FadeIn(boxes[3]), run_time=0.6)
        self.play(Create(a4), FadeIn(boxes[4]), run_time=0.6)
        self.play(Create(a5), FadeIn(boxes[5]), Flash(boxes[5], color=COLOR_EMERALD), run_time=0.8)

        # Indicador de estado final
        banner_box = RoundedRectangle(corner_radius=0.1, height=0.6, width=9.5, color=COLOR_EMERALD, fill_color="#064E3B", fill_opacity=0.8)
        banner_txt = Text("Principio: Cero datos inventados • Evidencias reproducibles al 100%", font_size=14, color=COLOR_INK)
        final_banner = VGroup(banner_box, banner_txt).to_edge(DOWN, buff=0.25)

        self.play(FadeIn(final_banner, shift=UP * 0.2), run_time=1)
        self.wait(2)
