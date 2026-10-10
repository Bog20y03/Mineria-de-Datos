from manim import *

COLOR_BG = "#0B0F17"
COLOR_TERRACOTTA = "#EA580C"
COLOR_BLUE = "#38BDF8"
COLOR_EMERALD = "#10B981"
COLOR_MUTED = "#64748B"
COLOR_INK = "#F8FAFC"

class NeuralNetAnimation(Scene):
    def construct(self):
        self.camera.background_color = COLOR_BG

        # Título
        title = Text("Atlas de Técnicas: Redes Neuronales (MLP)", font_size=30, color=COLOR_TERRACOTTA)
        subtitle = Text("Perceptrón Multicapa: Capas Densas, Pesos W y Feedforward", font_size=18, color=COLOR_MUTED)
        header = VGroup(title, subtitle).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        header.to_corner(UL, buff=0.5)

        self.play(FadeIn(header, shift=UP * 0.2), run_time=1)

        # Capa de Entrada (4 neuronas)
        inputs = VGroup(*[
            Circle(radius=0.25, color=COLOR_BLUE, fill_color="#1E293B", fill_opacity=0.9).move_to([-3.5, y, 0])
            for y in [1.5, 0.5, -0.5, -1.5]
        ])
        in_label = Text("Entrada (4)", font_size=16, color=COLOR_BLUE).next_to(inputs, UP, buff=0.3)

        # Capa Oculta (5 neuronas)
        hidden = VGroup(*[
            Circle(radius=0.25, color=COLOR_TERRACOTTA, fill_color="#1E293B", fill_opacity=0.9).move_to([0, y, 0])
            for y in [1.8, 0.9, 0, -0.9, -1.8]
        ])
        hid_label = Text("Capa Oculta (5)", font_size=16, color=COLOR_TERRACOTTA).next_to(hidden, UP, buff=0.3)

        # Capa de Salida (3 neuronas)
        outputs = VGroup(*[
            Circle(radius=0.25, color=COLOR_EMERALD, fill_color="#1E293B", fill_opacity=0.9).move_to([3.5, y, 0])
            for y in [1.0, 0, -1.0]
        ])
        out_label = Text("Salida (3)", font_size=16, color=COLOR_EMERALD).next_to(outputs, UP, buff=0.3)

        self.play(
            FadeIn(inputs), Write(in_label),
            FadeIn(hidden), Write(hid_label),
            FadeIn(outputs), Write(out_label),
            run_time=1.2
        )

        # Conexiones W1 (Entrada -> Oculta)
        lines_ih = VGroup(*[
            Line(i.get_right(), h.get_left(), stroke_width=1.2, stroke_opacity=0.35, color=COLOR_MUTED)
            for i in inputs for h in hidden
        ])

        # Conexiones W2 (Oculta -> Salida)
        lines_ho = VGroup(*[
            Line(h.get_right(), o.get_left(), stroke_width=1.2, stroke_opacity=0.35, color=COLOR_MUTED)
            for h in hidden for o in outputs
        ])

        self.play(Create(lines_ih), Create(lines_ho), run_time=1.5)

        # Propagación de señal (Feedforward pulse)
        pulse_txt = Text("Propagación: y = σ(W · x + b)", font_size=20, color=COLOR_BLUE)
        pulse_txt.to_edge(DOWN, buff=0.5)

        self.play(FadeIn(pulse_txt), inputs.animate.set_color(COLOR_BLUE), run_time=0.8)

        # Flash de activación capa oculta
        self.play(
            hidden.animate.set_color(COLOR_TERRACOTTA),
            lines_ih.animate.set_stroke(color=COLOR_TERRACOTTA, opacity=0.8),
            run_time=1
        )

        # Flash de activación salida
        done_txt = Text("Convergencia: Pérdida Entropía Cruzada = 0.04 (nnet en R)", font_size=18, color=COLOR_EMERALD)
        done_txt.to_edge(DOWN, buff=0.5)

        self.play(
            Transform(pulse_txt, done_txt),
            outputs.animate.set_color(COLOR_EMERALD),
            lines_ho.animate.set_stroke(color=COLOR_EMERALD, opacity=0.8),
            Flash(outputs[0], color=COLOR_EMERALD),
            run_time=1.2
        )
        self.wait(2)
