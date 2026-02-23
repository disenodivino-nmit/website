'use client';

import { useRef, useEffect, useState } from 'react';
import {
  Clock as ThreeClock,
  PerspectiveCamera as t,
  Scene as i,
  WebGLRenderer as s,
  SRGBColorSpace as n,
  MathUtils as o,
  Vector2 as r,
  Vector3 as a,
  MeshPhysicalMaterial as c,
  ShaderChunk as h,
  Color as l,
  Object3D as m,
  InstancedMesh as d,
  PMREMGenerator as p,
  SphereGeometry as g,
  AmbientLight as f,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Raycaster as y,
  Plane as w
} from 'three';
import { RoomEnvironment as z } from 'three/examples/jsm/environments/RoomEnvironment.js';

class x {
  #e: any;
  canvas: any;
  camera: any;
  cameraMinAspect: any;
  cameraMaxAspect: any;
  cameraFov: any;
  maxPixelRatio: any;
  minPixelRatio: any;
  scene: any;
  renderer: any;
  #t: any;
  size: any = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render: any = this.#i;
  onBeforeRender: any = () => {};
  onAfterRender: any = () => {};
  onAfterResize: any = () => {};
  #s = false;
  #n = false;
  isDisposed = false;
  #o: any;
  #r: any;
  #a: any;
  #c = new ThreeClock();
  #h = { elapsed: 0, delta: 0 };
  #l: any;
  constructor(e: any) {
    this.#e = { ...e };
    this.#m();
    this.#d();
    this.#p();
    this.resize();
    this.#g();
  }
  #m() {
    this.camera = new t();
    this.cameraFov = this.camera.fov;
  }
  #d() {
    this.scene = new i();
  }
  #p() {
    if (this.#e.canvas) {
      this.canvas = this.#e.canvas;
    } else if (this.#e.id) {
      this.canvas = document.getElementById(this.#e.id);
    } else {
      console.error('Three: Missing canvas or id parameter');
    }
    this.canvas.style.display = 'block';
    const e2: any = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(this.#e.rendererOptions ?? {})
    };
    this.renderer = new s(e2);
    this.renderer.outputColorSpace = n;
  }
  #g() {
    if (!(this.#e.size instanceof Object)) {
      window.addEventListener('resize', this.#f.bind(this));
      if (this.#e.size === 'parent' && this.canvas.parentNode) {
        this.#r = new ResizeObserver(this.#f.bind(this));
        this.#r.observe(this.canvas.parentNode);
      }
    }
    this.#o = new IntersectionObserver(this.#u.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#o.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#v.bind(this));
  }
  #y() {
    window.removeEventListener('resize', this.#f.bind(this));
    this.#r?.disconnect();
    this.#o?.disconnect();
    document.removeEventListener('visibilitychange', this.#v.bind(this));
  }
  #u(e: any) {
    this.#s = e[0].isIntersecting;
    this.#s ? this.#w() : this.#z();
  }
  #v() {
    if (this.#s) {
      document.hidden ? this.#z() : this.#w();
    }
  }
  #f() {
    if (this.#a) clearTimeout(this.#a);
    this.#a = setTimeout(this.resize.bind(this), 100);
  }
  resize() {
    let width: number, height: number;
    if (this.#e.size instanceof Object) {
      width = this.#e.size.width;
      height = this.#e.size.height;
    } else if (this.#e.size === 'parent' && this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth;
      height = this.canvas.parentNode.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.#x();
    this.#b();
    this.onAfterResize(this.size);
  }
  #x() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#A(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#A(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }
  #A(aspect: number) {
    const tan = Math.tan(o.degToRad(this.cameraFov / 2)) / (this.camera.aspect / aspect);
    this.camera.fov = 2 * o.radToDeg(Math.atan(tan));
  }
  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fov = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fov / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }
  #b() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#t?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }
  get postprocessing() {
    return this.#t;
  }
  set postprocessing(val) {
    this.#t = val;
    this.render = val.render.bind(val);
  }
  #w() {
    if (this.#n) return;
    const animate = () => {
      this.#l = requestAnimationFrame(animate);
      this.#h.delta = this.#c.getDelta();
      this.#h.elapsed += this.#h.delta;
      this.onBeforeRender(this.#h);
      this.render();
      this.onAfterRender(this.#h);
    };
    this.#n = true;
    this.#c.start();
    animate();
  }
  #z() {
    if (this.#n) {
      cancelAnimationFrame(this.#l);
      this.#n = false;
      this.#c.stop();
    }
  }
  #i() {
    this.renderer.render(this.scene, this.camera);
  }
  clear() {
    this.scene.traverse((obj: any) => {
      if (obj.isMesh && typeof obj.material === 'object' && obj.material !== null) {
        Object.keys(obj.material).forEach((key: string) => {
          const val = obj.material[key];
          if (val !== null && typeof val === 'object' && typeof val.dispose === 'function') {
            val.dispose();
          }
        });
        obj.material.dispose();
        obj.geometry.dispose();
      }
    });
    this.scene.clear();
  }
  dispose() {
    this.#y();
    this.#z();
    this.clear();
    this.#t?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

const b = new Map();
const A = new r();
let R = false;
function S(config: any) {
  const state: any = {
    position: new r(),
    nPosition: new r(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...config
  };
  (function (elem: any, st: any) {
    if (!b.has(elem)) {
      b.set(elem, st);
      if (!R) {
        document.body.addEventListener('pointermove', M);
        document.body.addEventListener('pointerleave', L);
        document.body.addEventListener('click', C);
        document.body.addEventListener('touchstart', TouchStart, { passive: false });
        document.body.addEventListener('touchmove', TouchMove, { passive: false });
        document.body.addEventListener('touchend', TouchEnd, { passive: false });
        document.body.addEventListener('touchcancel', TouchEnd, { passive: false });
        R = true;
      }
    }
  })(config.domElement, state);
  state.dispose = () => {
    const elem = config.domElement;
    b.delete(elem);
    if (b.size === 0) {
      document.body.removeEventListener('pointermove', M);
      document.body.removeEventListener('pointerleave', L);
      document.body.removeEventListener('click', C);
      document.body.removeEventListener('touchstart', TouchStart);
      document.body.removeEventListener('touchmove', TouchMove);
      document.body.removeEventListener('touchend', TouchEnd);
      document.body.removeEventListener('touchcancel', TouchEnd);
      R = false;
    }
  };
  return state;
}

function M(ev: PointerEvent) {
  A.x = ev.clientX;
  A.y = ev.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [elem, st] of b) {
    const rect = elem.getBoundingClientRect();
    if (D(rect)) {
      P(st, rect);
      if (!st.hover) {
        st.hover = true;
        st.onEnter(st);
      }
      st.onMove(st);
    } else if (st.hover && !st.touching) {
      st.hover = false;
      st.onLeave(st);
    }
  }
}

function C(ev: MouseEvent) {
  A.x = ev.clientX;
  A.y = ev.clientY;
  for (const [elem, st] of b) {
    const rect = elem.getBoundingClientRect();
    P(st, rect);
    if (D(rect)) st.onClick(st);
  }
}

function L() {
  for (const st of b.values()) {
    if (st.hover) {
      st.hover = false;
      st.onLeave(st);
    }
  }
}

function TouchStart(ev: TouchEvent) {
  if (ev.touches.length > 0) {
    A.x = ev.touches[0].clientX;
    A.y = ev.touches[0].clientY;
    let handled = false;
    for (const [elem, st] of b) {
      const rect = elem.getBoundingClientRect();
      if (D(rect)) {
        handled = true;
        st.touching = true;
        P(st, rect);
        if (!st.hover) {
          st.hover = true;
          st.onEnter(st);
        }
        st.onMove(st);
      }
    }
    if (handled) ev.preventDefault();
  }
}

function TouchMove(ev: TouchEvent) {
  if (ev.touches.length > 0) {
    A.x = ev.touches[0].clientX;
    A.y = ev.touches[0].clientY;
    let handled = false;
    for (const [elem, st] of b) {
      const rect = elem.getBoundingClientRect();
      P(st, rect);
      if (D(rect)) {
        handled = true;
        if (!st.hover) {
          st.hover = true;
          st.touching = true;
          st.onEnter(st);
        }
        st.onMove(st);
      } else if (st.hover && st.touching) {
        st.onMove(st);
      }
    }
    if (handled) ev.preventDefault();
  }
}

function TouchEnd() {
  for (const [, st] of b) {
    if (st.touching) {
      st.touching = false;
      if (st.hover) {
        st.hover = false;
        st.onLeave(st);
      }
    }
  }
}

function P(st: any, rect: DOMRect) {
  const { position: pos, nPosition: nPos } = st;
  pos.x = A.x - rect.left;
  pos.y = A.y - rect.top;
  nPos.x = (pos.x / rect.width) * 2 - 1;
  nPos.y = (-pos.y / rect.height) * 2 + 1;
}
function D(rect: DOMRect) {
  const { x: px, y: py } = A;
  const { left, top, width, height } = rect;
  return px >= left && px <= left + width && py >= top && py <= top + height;
}

const { randFloat: k, randFloatSpread: E } = o;
const F = new a();
const I = new a();
const O = new a();
const V = new a();
const B = new a();
const N = new a();
const _ = new a();
const j = new a();
const H = new a();
const T = new a();

class W {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: any;
  constructor(config: any) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new a();
    this.#R();
    this.setSizes();
  }
  #R() {
    const { config: cfg, positionData: pd } = this;
    this.center.toArray(pd, 0);
    for (let idx = 1; idx < cfg.count; idx++) {
      const base = 3 * idx;
      pd[base] = E(2 * cfg.maxX);
      pd[base + 1] = E(2 * cfg.maxY);
      pd[base + 2] = E(2 * cfg.maxZ);
    }
  }
  setSizes() {
    const { config: cfg, sizeData: sd } = this;
    sd[0] = cfg.size0;
    for (let idx = 1; idx < cfg.count; idx++) {
      sd[idx] = k(cfg.minSize, cfg.maxSize);
    }
  }
  update(time: any) {
    const { config: cfg, center: ctr, positionData: pd, sizeData: sd, velocityData: vd } = this;
    let startIdx = 0;
    if (cfg.controlSphere0) {
      startIdx = 1;
      F.fromArray(pd, 0);
      F.lerp(ctr, 0.1).toArray(pd, 0);
      V.set(0, 0, 0).toArray(vd, 0);
    }
    for (let idx = startIdx; idx < cfg.count; idx++) {
      const base = 3 * idx;
      I.fromArray(pd, base);
      B.fromArray(vd, base);
      B.y -= time.delta * cfg.gravity * sd[idx];
      B.multiplyScalar(cfg.friction);
      B.clampLength(0, cfg.maxVelocity);
      I.add(B);
      I.toArray(pd, base);
      B.toArray(vd, base);
    }
    for (let idx = startIdx; idx < cfg.count; idx++) {
      const base = 3 * idx;
      I.fromArray(pd, base);
      B.fromArray(vd, base);
      const radius = sd[idx];
      for (let jdx = idx + 1; jdx < cfg.count; jdx++) {
        const otherBase = 3 * jdx;
        O.fromArray(pd, otherBase);
        N.fromArray(vd, otherBase);
        const otherRadius = sd[jdx];
        _.copy(O).sub(I);
        const dist = _.length();
        const sumRadius = radius + otherRadius;
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          j.copy(_)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          H.copy(j).multiplyScalar(Math.max(B.length(), 1));
          T.copy(j).multiplyScalar(Math.max(N.length(), 1));
          I.sub(j);
          B.sub(H);
          I.toArray(pd, base);
          B.toArray(vd, base);
          O.add(j);
          N.add(T);
          O.toArray(pd, otherBase);
          N.toArray(vd, otherBase);
        }
      }
      if (cfg.controlSphere0) {
        _.copy(F).sub(I);
        const dist = _.length();
        const sumRadius0 = radius + sd[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          j.copy(_.normalize()).multiplyScalar(diff);
          H.copy(j).multiplyScalar(Math.max(B.length(), 2));
          I.sub(j);
          B.sub(H);
        }
      }
      if (Math.abs(I.x) + radius > cfg.maxX) {
        I.x = Math.sign(I.x) * (cfg.maxX - radius);
        B.x = -B.x * cfg.wallBounce;
      }
      if (cfg.gravity === 0) {
        if (Math.abs(I.y) + radius > cfg.maxY) {
          I.y = Math.sign(I.y) * (cfg.maxY - radius);
          B.y = -B.y * cfg.wallBounce;
        }
      } else if (I.y - radius < -cfg.maxY) {
        I.y = -cfg.maxY + radius;
        B.y = -B.y * cfg.wallBounce;
      }
      const maxBoundary = Math.max(cfg.maxZ, cfg.maxSize);
      if (Math.abs(I.z) + radius > maxBoundary) {
        I.z = Math.sign(I.z) * (cfg.maxZ - radius);
        B.z = -B.z * cfg.wallBounce;
      }
      I.toArray(pd, base);
      B.toArray(vd, base);
    }
  }
}

class Y extends c {
  uniforms: any;
  onBeforeCompile2?: (shader: any) => void;
  constructor(params: any) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 }
    };
    this.defines!.USE_UV = '';
    this.onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        '\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      ' +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      '
      );
      const t2 = h.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        '\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        '
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', t2);
      if (this.onBeforeCompile2) this.onBeforeCompile2(shader);
    };
  }
}

const X: any = {
  count: 200,
  colors: [0, 0, 0],
  ambientColor: 16777215,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const U = new m();

class Z extends d {
  config: any;
  physics: W;
  ambientLight: any;
  light: any;
  constructor(renderer: any, opts: any = {}) {
    const cfg = { ...X, ...opts };
    const room = new z();
    const pmrem = new p(renderer);
    const envMap = pmrem.fromScene(room).texture;
    const geo = new g();
    const mat = new Y({ envMap, ...cfg.materialParams });
    mat.envMapRotation.x = -Math.PI / 2;
    super(geo, mat, cfg.count);
    this.config = cfg;
    this.physics = new W(cfg);
    this.#S();
    this.setColors(cfg.colors);
  }
  #S() {
    this.ambientLight = new f(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new u(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }
  setColors(colors: any[]) {
    if (Array.isArray(colors) && colors.length > 1) {
      const gradient = (function (cols: any[]) {
        let colorsArr: any[];
        let colorObjects: l[];
        function setColors(c2: any[]) {
          colorsArr = c2;
          colorObjects = [];
          colorsArr.forEach(col => {
            colorObjects.push(new l(col));
          });
        }
        setColors(cols);
        return {
          setColors,
          getColorAt: function (ratio: number, out = new l()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (colorsArr.length - 1);
            const idx = Math.floor(scaled);
            const start = colorObjects[idx];
            if (idx >= colorsArr.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = colorObjects[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
          }
        };
      })(colors);
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, gradient.getColorAt(idx / this.count));
        if (idx === 0) {
          this.light.color.copy(gradient.getColorAt(idx / this.count));
        }
      }
      this.instanceColor!.needsUpdate = true;
    }
  }
  update(time: any) {
    this.physics.update(time);
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        U.scale.setScalar(0);
      } else {
        U.scale.setScalar(this.physics.sizeData[idx]);
      }
      U.updateMatrix();
      this.setMatrixAt(idx, U.matrix);
      if (idx === 0) this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas: HTMLCanvasElement, opts: any = {}) {
  const three = new x({
    canvas,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true }
  });
  let spheres: Z;
  three.renderer.toneMapping = v;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();
  initialize(opts);
  const raycaster = new y();
  const plane = new w(new a(0, 0, 1), 0);
  const intersect = new a();
  let paused = false;

  let pointer: any = null;
  if (opts.followCursor !== false) {
    canvas.style.touchAction = 'none';
    canvas.style.userSelect = 'none';
    (canvas.style as any).webkitUserSelect = 'none';

    pointer = S({
      domElement: canvas,
      onMove() {
        raycaster.setFromCamera(pointer.nPosition, three.camera);
        three.camera.getWorldDirection(plane.normal);
        raycaster.ray.intersectPlane(plane, intersect);
        spheres.physics.center.copy(intersect);
        spheres.config.controlSphere0 = true;
      },
      onLeave() {
        spheres.config.controlSphere0 = false;
      }
    });
  }
  function initialize(initOpts: any) {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new Z(three.renderer, initOpts);
    three.scene.add(spheres);
  }
  three.onBeforeRender = (time: any) => {
    if (!paused) spheres.update(time);
  };
  three.onAfterResize = (size: any) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };
  return {
    three,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      paused = !paused;
    },
    dispose() {
      pointer?.dispose();
      three.dispose();
    }
  };
}

interface BallpitProps {
  className?: string;
  followCursor?: boolean;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  colors?: string[];
  [key: string]: any;
}

const Ballpit = ({ className = '', followCursor = true, ...props }: BallpitProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spheresInstanceRef = useRef<ReturnType<typeof createBallpit> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    spheresInstanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas className={className} ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default Ballpit;




