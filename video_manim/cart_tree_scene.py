from manim import *

COLOR_BG = "#0B0F17"
COLOR_TERRACOTTA = "#EA580C"
COLOR_BLUE = "#38BDF8"
COLOR_EMERALD = "#10B981"
COLOR_MUTED = "#64748B"
COLOR_INK = "#F8FAFC"

class DecisionTreeAnimation(Scene):
    def construct(self):
        self.camera.background_color = COLOR_BG

        # Título
        title = Text("Atlas de Técnicas: Árbol de Clasificación (CART)", font_size=30, color=COLOR_TERRACOTTA)
        subtitle = Text("Algoritmo de Breiman: Partición Binaria Recursiva e Impureza Gini", font_size=18, color=COLOR_MUTED)
        header = VGroup(title, subtitle).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        header.to_corner(UL, buff=0.5)

        self.play(FadeIn(header, shift=UP * 0.2), run_time=1)

        # Nodo Raíz
        root_box = RoundedRectangle(corner_radius=0.15, height=0.9, width=3.4, color=COLOR_TERRACOTTA, fill_color="#1E293B", fill_opacity=0.9)
        root_txt = Text("Raíz: N=150 | Gini=0.66", font_size=16, color=COLOR_INK)
        root_node = VGroup(root_box, root_txt).move_to([0, 1.8, 0])

        self.play(FadeIn(root_node, shift=DOWN * 0.3), run_time=1)

        # Regla de división 1
        rule1 = Text("División: Petal.Width ≤ 0.8 cm", font_size=15, color=COLOR_BLUE)
        rule1.next_to(root_node, DOWN, buff=0.35)
        self.play(Write(rule1), run_time=0.8)

        # Hojas nivel 1
        # Izquierda (Pura)
        left_box = RoundedRectangle(corner_radius=0.15, height=0.85, width=3.0, color=COLOR_EMERALD, fill_color="#1E293B", fill_opacity=0.9)
        left_txt = Text("Setosa: N=50 | Gini=0.00", font_size=15, color=COLOR_EMERALD)
        left_leaf = VGroup(left_box, left_txt).move_to([-3.2, -0.4, 0])

        arrow_l = Arrow(root_node.get_bottom(), left_leaf.get_top(), buff=0.1, color=COLOR_MUTED, stroke_width=2.5)

        # Derecha (Impura)
        right_box = RoundedRectangle(corner_radius=0.15, height=0.85, width=3.2, color=COLOR_TERRACOTTA, fill_color="#1E293B", fill_opacity=0.9)
        right_txt = Text("Nodo 2: N=100 | Gini=0.50", font_size=15, color=COLOR_INK)
        right_node = VGroup(right_box, right_txt).move_to([3.2, -0.4, 0])

        arrow_r = Arrow(root_node.get_bottom(), right_node.get_top(), buff=0.1, color=COLOR_MUTED, stroke_width=2.5)

        self.play(Create(arrow_l), Create(arrow_r), FadeIn(left_leaf), FadeIn(right_node), run_time=1.2)
        self.wait(0.5)

        # Hojas nivel 2 (a partir del nodo derecho)
        leaf_r1_box = RoundedRectangle(corner_radius=0.12, height=0.75, width=2.8, color=COLOR_BLUE, fill_color="#1E293B", fill_opacity=0.9)
        leaf_r1_txt = Text("Versicolor: N=49 | Gini=0.08", font_size=14, color=COLOR_BLUE)
        leaf_r1 = VGroup(leaf_r1_box, leaf_r1_txt).move_to([1.6, -2.1, 0])

        leaf_r2_box = RoundedRectangle(corner_radius=0.12, height=0.75, width=2.8, color=COLOR_EMERALD, fill_color="#1E293B", fill_opacity=0.9)
        leaf_r2_txt = Text("Virginica: N=46 | Gini=0.04", font_size=14, color=COLOR_EMERALD)
        leaf_r2 = VGroup(leaf_r2_box, leaf_r2_txt).move_to([4.8, -2.1, 0])

        arrow_r1 = Arrow(right_node.get_bottom(), leaf_r1.get_top(), buff=0.1, color=COLOR_MUTED, stroke_width=2)
        arrow_r2 = Arrow(right_node.get_bottom(), leaf_r2.get_top(), buff=0.1, color=COLOR_MUTED, stroke_width=2)

        self.play(Create(arrow_r1), Create(arrow_r2), FadeIn(leaf_r1), FadeIn(leaf_r2), run_time=1.2)

        # Conclusión
        status_banner = Text("Poda Óptima: Exactitud 96.0% (rpart en R)", font_size=18, color=COLOR_EMERALD)
        status_banner.to_edge(DOWN, buff=0.3)
        self.play(FadeIn(status_banner, shift=UP * 0.2), Flash(leaf_r2, color=COLOR_EMERALD), run_time=1)
        self.wait(2)
