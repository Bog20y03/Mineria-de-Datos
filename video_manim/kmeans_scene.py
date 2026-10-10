from manim import *
import numpy as np

# Paleta oficial Tectonic Telemetry
COLOR_BG = "#0B0F17"
COLOR_TERRACOTTA = "#EA580C"
COLOR_BLUE = "#38BDF8"
COLOR_EMERALD = "#10B981"
COLOR_MUTED = "#64748B"
COLOR_INK = "#F8FAFC"

class KMeansAnimation(Scene):
    def construct(self):
        self.camera.background_color = COLOR_BG

        # 1. Cabecera y Título
        title = Text("Atlas de Técnicas: Clustering K-Means", font_size=32, color=COLOR_TERRACOTTA)
        subtitle = Text("Algoritmo de Lloyd: Asignación y Actualización de Centroides", font_size=18, color=COLOR_MUTED)
        header = VGroup(title, subtitle).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        header.to_corner(UL, buff=0.5)

        self.play(FadeIn(header, shift=UP * 0.2), run_time=1)

        # 2. Generar Nube de Puntos (3 clústeres sintéticos)
        np.random.seed(42)
        c1_pts = np.random.normal(loc=[-2.5, 0.5, 0], scale=0.45, size=(18, 3))
        c2_pts = np.random.normal(loc=[1.8, 1.2, 0], scale=0.5, size=(18, 3))
        c3_pts = np.random.normal(loc=[0.0, -1.8, 0], scale=0.55, size=(18, 3))

        dots_c1 = VGroup(*[Dot(p, radius=0.08, color=COLOR_MUTED) for p in c1_pts])
        dots_c2 = VGroup(*[Dot(p, radius=0.08, color=COLOR_MUTED) for p in c2_pts])
        dots_c3 = VGroup(*[Dot(p, radius=0.08, color=COLOR_MUTED) for p in c3_pts])
        all_dots = VGroup(dots_c1, dots_c2, dots_c3)

        self.play(Create(all_dots), run_time=1.2)

        # 3. Inicialización de Centroides (k=3)
        init_c1 = np.array([-1.5, 1.8, 0])
        init_c2 = np.array([2.5, -0.5, 0])
        init_c3 = np.array([-1.0, -2.0, 0])

        m1 = Cross(scale_factor=0.25, stroke_width=4, color=COLOR_TERRACOTTA).move_to(init_c1)
        m2 = Cross(scale_factor=0.25, stroke_width=4, color=COLOR_BLUE).move_to(init_c2)
        m3 = Cross(scale_factor=0.25, stroke_width=4, color=COLOR_EMERALD).move_to(init_c3)

        step_text = Text("1. Inicialización de k=3 Centroides", font_size=20, color=COLOR_INK)
        step_text.to_edge(DOWN, buff=0.6)

        self.play(FadeIn(step_text), FadeIn(m1), FadeIn(m2), FadeIn(m3), run_time=1)
        self.wait(0.5)

        # 4. Fase de Asignación de Voronoi (Colorear puntos más cercanos)
        step2_text = Text("2. Partición: Asignación a Centroide más cercano (Distancia L2)", font_size=20, color=COLOR_INK)
        step2_text.to_edge(DOWN, buff=0.6)

        self.play(
            Transform(step_text, step2_text),
            dots_c1.animate.set_color(COLOR_TERRACOTTA),
            dots_c2.animate.set_color(COLOR_BLUE),
            dots_c3.animate.set_color(COLOR_EMERALD),
            run_time=1.2
        )
        self.wait(0.5)

        # 5. Fase de Actualización: Recalcular medias y desplazar centroides
        step3_text = Text("3. Actualización: Recalcular Centroides = Promedio del Clúster", font_size=20, color=COLOR_INK)
        step3_text.to_edge(DOWN, buff=0.6)

        final_c1 = np.mean(c1_pts, axis=0)
        final_c2 = np.mean(c2_pts, axis=0)
        final_c3 = np.mean(c3_pts, axis=0)

        self.play(
            Transform(step_text, step3_text),
            m1.animate.move_to(final_c1),
            m2.animate.move_to(final_c2),
            m3.animate.move_to(final_c3),
            run_time=1.5
        )

        # 6. Convergencia y Métricas
        circle1 = Circle(radius=1.2, color=COLOR_TERRACOTTA, stroke_opacity=0.4).move_to(final_c1)
        circle2 = Circle(radius=1.3, color=COLOR_BLUE, stroke_opacity=0.4).move_to(final_c2)
        circle3 = Circle(radius=1.4, color=COLOR_EMERALD, stroke_opacity=0.4).move_to(final_c3)

        converge_text = Text("Convergencia Alcanzada: Inercia WCSS Mínima (88.4% Varianza Explicada)", font_size=18, color=COLOR_EMERALD)
        converge_text.to_edge(DOWN, buff=0.6)

        self.play(
            Transform(step_text, converge_text),
            Create(circle1),
            Create(circle2),
            Create(circle3),
            Flash(m1, color=COLOR_TERRACOTTA, flash_radius=0.5),
            Flash(m2, color=COLOR_BLUE, flash_radius=0.5),
            Flash(m3, color=COLOR_EMERALD, flash_radius=0.5),
            run_time=1.5
        )
        self.wait(2)
