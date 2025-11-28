# Evaluación de portafolio – Módulo 2

Este proyecto corresponde a la evaluación del **Módulo 2** del bootcamp _Full Stack JavaScript – Talento Digital_.  
Integra HTML5, CSS3, Bootstrap, JavaScript y jQuery para construir un sitio web básico, responsivo y funcional que muestra evidencia de trabajo realizado durante el curso.

---

## Requerimientos funcionales mínimos esperados

- Utilizar el lenguaje de etiquetas **HTML5** para estructurar el contenido de la página.
- Aplicar **hojas de estilo CSS** básicas, incluyendo elementos de responsividad.
- Implementar un sitio web básico **responsivo utilizando Bootstrap 5**.
- Utilizar **JavaScript** para la personalización de eventos sencillos dentro del documento HTML.
- Utilizar la biblioteca **jQuery** para incorporar elementos dinámicos mediante el manejo del DOM.
- Gestionar el código fuente utilizando **Git y GitHub**.

---

## Descripción del proyecto

Este repositorio contiene un **portafolio web personal** dividido en dos secciones principales:

1. **Inicio (Sobre mí)**  
   Presentación personal con fotografía de perfil y una breve reseña sobre formación, intereses y contexto personal.

2. **Proyectos**  
   Carrusel con tres proyectos desarrollados durante el bootcamp. Cada slide incluye título, imagen responsiva, descripción breve y enlace al repositorio del proyecto correspondiente.

El objetivo principal es exhibir evidencia técnica y competencias básicas en desarrollo front-end.

---

## Funcionalidades implementadas

- **Navegación mediante pestañas (Tabs)**  
  Implementada manualmente con jQuery para alternar entre “Inicio” y “Proyectos”.

- **Carrusel de proyectos**  
  Carrusel controlado con jQuery que incluye:

  - botones _siguiente_ y _anterior_,
  - indicadores interactivos,
  - soporte para imágenes adaptadas a móvil/desktop,
  - enlaces internos en cada slide que funcionan normalmente.

- **Diseño responsivo**  
  Base en Bootstrap 5 y ajustes adicionales en `style.css` para optimizar presentación en distintos tamaños de pantalla.

- **Separación de responsabilidades**  
  Archivos separados por función: `index.html`, `style.css`, `script.js` y carpeta `img/`.

---

## Estructura del proyecto

```
/
├── index.html
├── style.css
├── script.js
├── README.md
└── img/
├── foto-perfil.png
├── perfil de RRSS con CSS.png
├── perfil-RRSS-mobile.png
├── librería online con JS.png
├── libreria-online-mobile.png
├── cineflash.png
└── cineflash-mobile.png
```

## Instrucciones de uso

1. Abrir `index.html` en cualquier navegador moderno.
2. Navegar entre las pestañas **Inicio** y **Proyectos** (hacer clic en las pestañas superiores).
3. En la sección **Proyectos**, usar los botones del carrusel o los indicadores para cambiar de slide.
4. Hacer clic en los enlaces de cada proyecto para abrir su repositorio en GitHub.

> No se requiere servidor ni instalación adicional para visualizar el sitio (archivo estático).

---

## Decisiones técnicas

- **Control manual de tabs y carrusel**  
  Aunque Bootstrap 5 soporta tabs y carrusel mediante atributos `data-bs-*`, la lógica se implementó manualmente con jQuery para demostrar manipulación del DOM y eventos.

- **Responsividad combinada**  
  Bootstrap como base + reglas CSS personalizadas para controlar alturas, comportamiento del carrusel y presentación de la foto de perfil en móviles.
