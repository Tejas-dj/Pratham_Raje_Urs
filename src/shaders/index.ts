/* Shaders exported as TypeScript string constants — no loader config needed */

export const filmGrainVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
