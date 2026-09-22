"use client";

import { useEffect, useRef, useState } from "react";

interface LiquidSmokeCanvasProps {
  logoSrc?: string;
  dissolve?: number; // 0 (full smoke) to 1 (completely dissolved)
  mousePos?: { x: number; y: number }; // normalized 0..1
  className?: string;
}

export default function LiquidSmokeCanvas({
  logoSrc = "/images/brand/logo.png",
  dissolve = 0,
  mousePos = { x: 0.5, y: 0.5 },
  className = "",
}: LiquidSmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  const dissolveRef = useRef(dissolve);
  const mouseRef = useRef(mousePos);

  useEffect(() => {
    dissolveRef.current = dissolve;
  }, [dissolve]);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // Vertex Shader: Fullscreen Quad
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Domain-Warped fBM Liquid Smoke with Mouse Curl & Dissolve
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_dissolve;
      uniform sampler2D u_logo;
      uniform float u_logo_aspect;
      uniform float u_has_logo;

      // Pseudo-random & Noise functions
      float hash(vec2 p) {
        p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
        return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
      }

      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 aspectUV = vec2(uv.x * aspect, uv.y);

        // Interactive mouse curl perturbation
        vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
        vec2 mDiff = aspectUV - m;
        float mDist = length(mDiff);
        float mInfluence = exp(-mDist * 4.0);
        vec2 mSwirl = vec2(-mDiff.y, mDiff.x) * mInfluence * 0.35;

        // Dissolve expansion / wind tear field
        vec2 center = vec2(0.5 * aspect, 0.5);
        vec2 blowDirection = normalize(aspectUV - center + vec2(0.0, 0.15));
        float blowMagnitude = u_dissolve * 2.2;
        vec2 windOffset = blowDirection * blowMagnitude;

        // Primary Domain Warping for liquid smoke billows
        vec2 st = aspectUV * 1.8;
        vec2 q = vec2(
          fbm(st + vec2(0.0, 0.0) + u_time * 0.04 + windOffset * 0.5),
          fbm(st + vec2(5.2, 1.3) + u_time * 0.03 - windOffset * 0.3)
        );

        vec2 r = vec2(
          fbm(st + 3.2 * q + vec2(1.7, 9.2) + u_time * 0.07 + mSwirl + windOffset),
          fbm(st + 3.2 * q + vec2(8.3, 2.8) + u_time * 0.05 - mSwirl + windOffset * 1.2)
        );

        float smokePattern = fbm(st + 3.6 * r + u_time * 0.06);

        // Shape smoke volume: denser around center/logo, soft at edges
        float centerDist = length(uv - vec2(0.5, 0.48));
        float vignette = smoothstep(0.95, 0.25, centerDist);

        // Compute smoke density & shredding under dissolution
        float density = smokePattern * 0.5 + 0.5;
        density = density * vignette;
        
        // Dissolve thresholding (shreds into wisps as u_dissolve approaches 1)
        float dissolveThreshold = u_dissolve * 1.4;
        density = smoothstep(dissolveThreshold, dissolveThreshold + 0.45, density);
        density *= (1.0 - smoothstep(0.7, 1.0, u_dissolve));

        // Smoke coloration (Deep metallic charcoal with luminous silver highlights)
        vec3 deepSmoke = vec3(0.02, 0.02, 0.025);
        vec3 midSmoke = vec3(0.12, 0.12, 0.14);
        vec3 lightSmoke = vec3(0.45, 0.45, 0.48);

        vec3 smokeColor = mix(deepSmoke, midSmoke, smoothstep(0.1, 0.6, density));
        smokeColor = mix(smokeColor, lightSmoke, pow(r.y * 0.5 + 0.5, 3.0) * 0.4);

        // Logo Texture Sampling & Masking
        vec4 finalOutput = vec4(smokeColor, density * 0.95);

        if (u_has_logo > 0.5) {
          // Centered logo coordinates with preserved aspect ratio
          float targetLogoWidth = 0.42; // percentage of viewport width on desktop
          if (aspect < 1.0) {
            targetLogoWidth = 0.75; // mobile sizing
          }
          float targetLogoHeight = targetLogoWidth / u_logo_aspect;

          vec2 logoMin = vec2(0.5 - targetLogoWidth * 0.5, 0.5 - targetLogoHeight * 0.5);
          vec2 logoMax = vec2(0.5 + targetLogoWidth * 0.5, 0.5 + targetLogoHeight * 0.5);

          // Displace logo UV slightly with smoke flow for liquid mirage feel
          vec2 distortedUV = uv + (r * 0.025 * (1.0 - u_dissolve)) + (windOffset * 0.1);

          if (distortedUV.x >= logoMin.x && distortedUV.x <= logoMax.x &&
              distortedUV.y >= logoMin.y && distortedUV.y <= logoMax.y) {
            
            vec2 logoTexCoord = (distortedUV - logoMin) / (logoMax - logoMin);
            // Invert Y for standard WebGL texture coordinates
            logoTexCoord.y = 1.0 - logoTexCoord.y;

            vec4 logoColor = texture2D(u_logo, logoTexCoord);

            // Dissolve logo along with smoke
            float logoFade = (1.0 - smoothstep(0.15, 0.85, u_dissolve));
            float logoAlpha = logoColor.a * logoFade;

            // Blend metallic logo with volumetric smoke
            vec3 blendedColor = mix(finalOutput.rgb, logoColor.rgb * 1.15, logoAlpha);
            float blendedAlpha = max(finalOutput.a, logoAlpha);

            finalOutput = vec4(blendedColor, blendedAlpha);
          }
        }

        // Output color with alpha premultiplication
        gl_FragColor = vec4(finalOutput.rgb * finalOutput.a, finalOutput.a);
      }
    `;

    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uDissolve = gl.getUniformLocation(program, "u_dissolve");
    const uLogo = gl.getUniformLocation(program, "u_logo");
    const uLogoAspect = gl.getUniformLocation(program, "u_logo_aspect");
    const uHasLogo = gl.getUniformLocation(program, "u_has_logo");

    // Enable Alpha Blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Texture for Logo
    const texture = gl.createTexture();
    let logoLoaded = false;
    let logoAspect = 1.0;

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logoSrc;
    logoImg.onload = () => {
      if (!gl) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        logoImg
      );
      logoAspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
      logoLoaded = true;
    };

    // Smooth Lerped Mouse Coordinates for inertia
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    // Resize Handler
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Render Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      // Lerp mouse
      currentMouseX += (mouseRef.current.x - currentMouseX) * 0.06;
      currentMouseY += (mouseRef.current.y - currentMouseY) * 0.06;

      gl.useProgram(program);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, currentMouseX, 1.0 - currentMouseY); // invert Y for GL
      gl.uniform1f(uDissolve, dissolveRef.current);

      if (logoLoaded) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uLogo, 0);
        gl.uniform1f(uLogoAspect, logoAspect);
        gl.uniform1f(uHasLogo, 1.0);
      } else {
        gl.uniform1f(uHasLogo, 0.0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
    };
  }, [logoSrc]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none pointer-events-none"
      />

      {/* Graceful Fallback if WebGL unsupported */}
      {!hasWebGL && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30,30,35,0.9), #050505)`,
          }}
        />
      )}
    </div>
  );
}
