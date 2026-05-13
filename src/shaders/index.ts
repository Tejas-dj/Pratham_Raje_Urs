/* Shaders exported as TypeScript string constants — no loader config needed */

export const filmGrainVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const filmGrainFrag = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 uv = vUv;

  // Film grain
  float grain = hash(uv * uResolution * 0.5 + fract(uTime * 0.07)) * uIntensity;
  grain = pow(grain, 0.7);

  // Vertical scratches — thin, rare, fast-moving
  float scratchX = floor(uv.x * uResolution.x * 0.6 + fract(uTime * 12.0) * 200.0) / (uResolution.x * 0.6);
  float scratch = step(0.997, hash(vec2(scratchX, fract(uTime * 0.4))));
  scratch *= smoothstep(0.0, 0.04, uv.y) * smoothstep(0.0, 0.04, 1.0 - uv.y);
  scratch *= noise(vec2(uv.y * 8.0, uTime * 5.0)) * 0.7 + 0.3;

  // Dust specks
  float dust = step(0.9995, hash(uv * 300.0 + fract(uTime * 0.12)));
  dust *= 0.6;

  float alpha = grain * 0.30 + scratch * 0.55 + dust;

  gl_FragColor = vec4(vec3(0.92, 0.88, 0.78) * (grain + scratch * 0.5 + dust * 0.5), alpha);
}
`;

export const lightLeakFrag = /* glsl */ `
uniform vec2 uMouse;
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse * 0.5 + 0.5;

  // Warm horizontal streak following mouse Y
  float streakY = abs(uv.y - mouse.y * 0.6 - 0.2);
  float streak = smoothstep(0.25, 0.0, streakY);
  streak *= smoothstep(0.0, 0.15, uv.x) * smoothstep(0.0, 0.15, 1.0 - uv.x);

  // Secondary streak at different position
  float streak2Y = abs(uv.y - (1.0 - mouse.y) * 0.4 - 0.5);
  float streak2 = smoothstep(0.18, 0.0, streak2Y) * 0.4;
  streak2 *= smoothstep(0.3, 0.7, uv.x);

  // Animate intensity
  float breathe = 0.12 + 0.04 * sin(uTime * 0.3) + 0.03 * sin(uTime * 0.7 + 1.2);
  float total = (streak + streak2) * breathe * uIntensity;

  // Warm amber/gold color
  vec3 leakColor = vec3(0.95, 0.75, 0.42); // warm amber

  gl_FragColor = vec4(leakColor, total);
}
`;

export const filmBurnFrag = /* glsl */ `
uniform float uProgress;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5, 0.5);

  // Radial burn from center outward
  float dist = length(uv - center) * 1.5;
  float noise = hash(uv * 8.0) * 0.15;

  float burn = smoothstep(uProgress - 0.2 + noise, uProgress + 0.05, 1.0 - dist);

  // Edge scorch
  float edge = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x)
             * smoothstep(0.0, 0.06, uv.y) * smoothstep(0.0, 0.06, 1.0 - uv.y);
  float scorch = (1.0 - edge) * uProgress * 0.8;

  // Overexposure color: warm white
  vec3 burnColor = mix(vec3(1.0, 0.97, 0.88), vec3(1.0, 1.0, 1.0), uProgress);

  float alpha = clamp(burn + scorch, 0.0, 1.0);
  gl_FragColor = vec4(burnColor, alpha);
}
`;

export const parallaxBlendFrag = /* glsl */ `
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uBlend;
uniform vec2 uParallax;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Subtle parallax offset driven by mouse
  vec2 uv1 = uv + uParallax * 0.015;
  vec2 uv2 = uv + uParallax * 0.008;

  // Clamp to avoid edge artifacts
  uv1 = clamp(uv1, 0.001, 0.999);
  uv2 = clamp(uv2, 0.001, 0.999);

  vec4 tex1 = texture2D(uTexture1, uv1);
  vec4 tex2 = texture2D(uTexture2, uv2);

  // Cinematic blend: slight vignette
  float vignette = smoothstep(0.0, 0.5, uv.x) * smoothstep(0.0, 0.5, 1.0 - uv.x)
                 * smoothstep(0.0, 0.3, uv.y) * smoothstep(0.0, 0.3, 1.0 - uv.y);
  vignette = mix(0.3, 1.0, vignette);

  vec4 color = mix(tex1, tex2, uBlend) * vignette;

  // Slight color grade: warm shadows, teal highlights
  color.r = mix(color.r, color.r * 0.95 + 0.02, 0.3);
  color.b = mix(color.b, color.b * 1.05, 0.2);

  gl_FragColor = color;
}
`;

export const lensFlareVert = filmGrainVert;

export const lensFlareFrag = /* glsl */ `
uniform vec2 uCenter;
uniform float uIntensity;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 toCenter = uCenter - uv;
  float dist = length(toCenter);

  // Main flare disk
  float flare = smoothstep(0.3, 0.0, dist) * uIntensity;

  // Anamorphic streak (horizontal)
  float streak = smoothstep(0.02, 0.0, abs(uv.y - uCenter.y));
  streak *= smoothstep(0.0, 0.2, uv.x) * smoothstep(0.0, 0.2, 1.0 - uv.x);
  streak *= 0.3 * uIntensity;

  // Lens rings
  float ring1 = smoothstep(0.004, 0.0, abs(dist - 0.12)) * 0.3 * uIntensity;
  float ring2 = smoothstep(0.003, 0.0, abs(dist - 0.22)) * 0.15 * uIntensity;

  float total = flare * 0.4 + streak + ring1 + ring2;

  // Gold-white flare color
  vec3 color = mix(vec3(0.98, 0.85, 0.5), vec3(1.0, 1.0, 0.95), flare);

  gl_FragColor = vec4(color, total * 0.6);
}
`;
