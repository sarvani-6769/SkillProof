import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SkillProofThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0508, 0.018);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 1. Constellation Network of Verified Skill Nodes
    const nodeCount = 140;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 58;
      const y = (Math.random() - 0.5) * 44;
      const z = (Math.random() - 0.5) * 36 - 6;

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      nodeVelocities.push({
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
        vz: (Math.random() - 0.5) * 0.012,
      });
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    // Glowing Node Points Material - Vibrant Rose
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0xf43f5e,
      size: 0.75,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const nodeMesh = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodeMesh);

    // Connecting Network Lines
    const maxConnections = nodeCount * 4;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 2. Central Verification Geometric Shield / Icosahedron Core
    const coreGroup = new THREE.Group();
    coreGroup.position.set(16, 2, -2);

    const icoGeo = new THREE.IcosahedronGeometry(7, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xe0231c,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner glowing ring - Warm Amber
    const ringGeo = new THREE.TorusGeometry(8.2, 0.08, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh);

    // Second orbital ring - Luminous Rose
    const ringGeo2 = new THREE.TorusGeometry(9.6, 0.05, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    coreGroup.add(ringMesh2);

    scene.add(coreGroup);

    // 3. Shimmering Ambient Dust Particles
    const dustCount = 300;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 80;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustMesh);

    // Mouse Tracking with Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = normX * 3.5;
      targetY = normY * 2.5;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Scroll Position Tracking
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      const scrollOffset = scrollY * 0.015;
      camera.position.x = mouseX;
      camera.position.y = mouseY - scrollOffset * 0.4;
      camera.position.z = 36 - Math.min(scrollOffset * 0.8, 12);
      camera.lookAt(0, -scrollOffset * 0.35, 0);

      // Rotate geometric core
      coreGroup.rotation.x = elapsedTime * 0.12;
      coreGroup.rotation.y = elapsedTime * 0.18;
      ringMesh.rotation.z = elapsedTime * 0.25;
      ringMesh2.rotation.z = -elapsedTime * 0.18;

      // Animate skill nodes
      const posArray = nodeGeometry.attributes.position.array;
      for (let i = 0; i < nodeCount; i++) {
        const idx = i * 3;
        posArray[idx] += nodeVelocities[i].vx;
        posArray[idx + 1] += nodeVelocities[i].vy;
        posArray[idx + 2] += nodeVelocities[i].vz;

        // Bounce within bounding volume
        if (Math.abs(posArray[idx]) > 30) nodeVelocities[i].vx *= -1;
        if (Math.abs(posArray[idx + 1]) > 22) nodeVelocities[i].vy *= -1;
        if (Math.abs(posArray[idx + 2]) > 20) nodeVelocities[i].vz *= -1;
      }
      nodeGeometry.attributes.position.needsUpdate = true;

      // Reconnect close nodes
      let lineVertexIndex = 0;
      let lineSegmentCount = 0;
      const connectionDist = 8.5;
      const connectionDistSq = connectionDist * connectionDist;

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        const x1 = posArray[i3];
        const y1 = posArray[i3 + 1];
        const z1 = posArray[i3 + 2];

        for (let j = i + 1; j < nodeCount; j++) {
          const j3 = j * 3;
          const x2 = posArray[j3];
          const y2 = posArray[j3 + 1];
          const z2 = posArray[j3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDistSq && lineSegmentCount < maxConnections) {
            const alpha = 1.0 - Math.sqrt(distSq) / connectionDist;

            linePositions[lineVertexIndex * 3] = x1;
            linePositions[lineVertexIndex * 3 + 1] = y1;
            linePositions[lineVertexIndex * 3 + 2] = z1;

            linePositions[(lineVertexIndex + 1) * 3] = x2;
            linePositions[(lineVertexIndex + 1) * 3 + 1] = y2;
            linePositions[(lineVertexIndex + 1) * 3 + 2] = z2;

            // Gradient coloring: Rose to Amber
            lineColors[lineVertexIndex * 3] = 0.96 * alpha;
            lineColors[lineVertexIndex * 3 + 1] = 0.25 * alpha;
            lineColors[lineVertexIndex * 3 + 2] = 0.35 * alpha;

            lineColors[(lineVertexIndex + 1) * 3] = 0.96 * alpha;
            lineColors[(lineVertexIndex + 1) * 3 + 1] = 0.62 * alpha;
            lineColors[(lineVertexIndex + 1) * 3 + 2] = 0.04 * alpha;

            lineVertexIndex += 2;
            lineSegmentCount++;
          }
        }
      }
      lineGeometry.setDrawRange(0, lineSegmentCount * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      // Dust drift
      dustMesh.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default SkillProofThreeScene;
