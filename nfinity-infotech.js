class NfinityInfotech3D {
    constructor() {
        // Core elements
        this.canvas = document.getElementById('canvas');
        this.loading = document.getElementById('loading');
        
        // Controls
        this.switchTheme = document.getElementById('switchTheme');
        
        // Audio removed for cleaner experience
        
        // State
        this.isInitialized = false;
        this.isPlaying = true;
        this.currentTheme = 0;
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // 3D Objects representing business concepts
        this.codeBlocks = [];
        this.dataFlows = [];
        this.digitalElements = [];
        
        // Environment
        this.stage = null;
        this.lights = [];
        this.particles = null;
        
        // Animation
        this.time = 0;
        this.themes = [
            { 
                name: 'Forest', 
                colors: [0x228B22, 0x32CD32, 0x90EE90],
                bgColor: 0x0d2818,
                fogColor: 0x1a4a2e,
                stageColor: 0x2d5016,
                particleColors: [0x228B22, 0x90EE90, 0xFFFF00],
                environment: 'forest'
            },
            { 
                name: 'Space', 
                colors: [0x9932CC, 0x4169E1, 0x00CED1],
                bgColor: 0x000011,
                fogColor: 0x000033,
                stageColor: 0x1a1a2e,
                particleColors: [0x9932CC, 0x4169E1, 0xFFFFFF],
                environment: 'space'
            },
            { 
                name: 'City', 
                colors: [0xFF6347, 0xFFD700, 0x00BFFF],
                bgColor: 0x2f1b14,
                fogColor: 0x4a3a2a,
                stageColor: 0x3a3a3a,
                particleColors: [0xFF6347, 0xFFD700, 0x00BFFF],
                environment: 'city'
            }
        ];
        
        // Environment objects
        this.environmentObjects = [];
        this.currentEnvironment = null;
        
        // Camera control
        this.cameraController = {
            angle: 0,
            radius: 30,
            height: 15,
            targetHeight: 15,
            autoRotate: true
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.initThreeJS();
            await this.createBusinessElements();
            await this.setupLighting();
            await this.createStageEffects();
            
            this.isInitialized = true;
            this.setupControls();
            
            // Hide loading screen
            setTimeout(() => {
                this.loading.style.opacity = '0';
                setTimeout(() => {
                    this.loading.style.display = 'none';
                }, 800);
            }, 2000);
            
            this.startRenderLoop();
            
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }
    
    async initThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0f0f23, 40, 120);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            65,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 15, 30);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0f0f23, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Ensure cursor is visible on canvas
        this.canvas.style.cursor = 'auto';
        
        // Create digital stage
        await this.createDigitalStage();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        return Promise.resolve();
    }
    
    async createDigitalStage() {
        // Main platform - representing the digital foundation
        const stageGeometry = new THREE.CylinderGeometry(25, 25, 1, 6);
        const stageMaterial = new THREE.MeshLambertMaterial({
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.7
        });
        
        this.stage = new THREE.Mesh(stageGeometry, stageMaterial);
        this.stage.position.y = -0.5;
        this.stage.receiveShadow = true;
        this.scene.add(this.stage);
        
        // Digital grid effect
        const gridSize = 50;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x4ecdc4, 0x1a1a2e);
        gridHelper.position.y = 0;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        
        return Promise.resolve();
    }
    
    async createBusinessElements() {
        // Create simplified code blocks representing rapid development
        await this.createSimplifiedCodeBlocks();
        
        // Create simplified digital elements
        await this.createSimplifiedDigitalElements();
        
        return Promise.resolve();
    }
    
    async createSimplifiedCodeBlocks() {
        const codeBlockConfigs = [
            { position: { x: -6, y: 2, z: -4 }, color: 0x4ecdc4 },
            { position: { x: 6, y: 3, z: -2 }, color: 0x45b7d1 },
            { position: { x: 0, y: 4, z: -6 }, color: 0x96ceb4 }
        ];
        
        for (let config of codeBlockConfigs) {
            const geometry = new THREE.BoxGeometry(1.5, 2, 0.8);
            const material = new THREE.MeshPhongMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.8
            });
            
            const codeBlock = new THREE.Mesh(geometry, material);
            codeBlock.position.set(config.position.x, config.position.y, config.position.z);
            codeBlock.castShadow = true;
            
            codeBlock.userData = {
                type: 'codeBlock',
                originalPosition: { ...config.position },
                baseColor: config.color,
                animationPhase: Math.random() * Math.PI * 2
            };
            
            this.codeBlocks.push(codeBlock);
            this.scene.add(codeBlock);
        }
        
        return Promise.resolve();
    }
    
    async createSimplifiedDigitalElements() {
        // Create just a few simple digital elements
        const elementConfigs = [
            { position: { x: 8, y: 2, z: 6 }, color: 0x45b7d1 },
            { position: { x: -8, y: 3, z: 8 }, color: 0x96ceb4 }
        ];
        
        for (let config of elementConfigs) {
            const geometry = new THREE.OctahedronGeometry(1.2);
            const material = new THREE.MeshPhongMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.7
            });
            
            const element = new THREE.Mesh(geometry, material);
            element.position.set(config.position.x, config.position.y, config.position.z);
            element.castShadow = true;
            
            element.userData = {
                type: 'digitalElement',
                originalPosition: { ...config.position },
                rotationSpeed: 0.01 + Math.random() * 0.02,
                baseColor: config.color
            };
            
            this.digitalElements.push(element);
            this.scene.add(element);
        }
        
        return Promise.resolve();
    }
    
    async setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 100;
        mainLight.shadow.camera.left = -20;
        mainLight.shadow.camera.right = 20;
        mainLight.shadow.camera.top = 20;
        mainLight.shadow.camera.bottom = -20;
        this.scene.add(mainLight);
        this.lights.push(mainLight);
        
        // Accent lights with business theme colors
        const accentColors = [0x4ecdc4, 0x45b7d1, 0x96ceb4];
        const accentPositions = [
            { x: -20, y: 15, z: 0 },
            { x: 20, y: 15, z: 0 },
            { x: 0, y: 15, z: -20 }
        ];
        
        for (let i = 0; i < 3; i++) {
            const accentLight = new THREE.PointLight(accentColors[i], 0.8, 35);
            accentLight.position.set(accentPositions[i].x, accentPositions[i].y, accentPositions[i].z);
            this.scene.add(accentLight);
            this.lights.push(accentLight);
        }
        
        return Promise.resolve();
    }
    
    async createEnvironment(type) {
        // Clear existing environment
        this.clearEnvironment();
        
        switch(type) {
            case 'forest':
                await this.createForestEnvironment();
                break;
            case 'space':
                await this.createSpaceEnvironment();
                break;
            case 'city':
                await this.createCityEnvironment();
                break;
        }
        
        this.currentEnvironment = type;
        return Promise.resolve();
    }
    
    clearEnvironment() {
        this.environmentObjects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.environmentObjects = [];
    }
    
    async createForestEnvironment() {
        // Create simplified forest elements - less objects for faster loading
        
        // Create a few trees
        for (let i = 0; i < 8; i++) {
            const tree = this.createSimpleTree();
            const angle = (i / 8) * Math.PI * 2;
            const radius = 30 + Math.random() * 15;
            tree.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            this.environmentObjects.push(tree);
            this.scene.add(tree);
        }
        
        // Create a few mystical elements
        for (let i = 0; i < 6; i++) {
            const mysticalElement = this.createSimpleMysticalElement(i);
            const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
            const radius = 25 + Math.random() * 10;
            mysticalElement.position.set(
                Math.cos(angle) * radius,
                Math.random() * 3,
                Math.sin(angle) * radius
            );
            this.environmentObjects.push(mysticalElement);
            this.scene.add(mysticalElement);
        }
        
        return Promise.resolve();
    }
    
    createSimpleTree() {
        const tree = new THREE.Group();
        
        // Simple trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 3;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Simple foliage
        const foliageGeometry = new THREE.SphereGeometry(2.5, 8, 6);
        const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 7;
        foliage.castShadow = true;
        tree.add(foliage);
        
        tree.userData = { type: 'tree', swayPhase: Math.random() * Math.PI };
        return tree;
    }
    
    createSimpleMysticalElement(index) {
        const shapes = [
            () => new THREE.OctahedronGeometry(0.8),
            () => new THREE.ConeGeometry(0.6, 2, 6),
            () => new THREE.DodecahedronGeometry(0.6)
        ];
        
        const colors = [0x228B22, 0x32CD32, 0x90EE90, 0x8B4513, 0x2E8B57];
        
        const geometry = shapes[index % shapes.length]();
        const material = new THREE.MeshPhongMaterial({
            color: colors[index % colors.length],
            transparent: true,
            opacity: 0.8
        });
        
        const mysticalElement = new THREE.Mesh(geometry, material);
        mysticalElement.castShadow = true;
        
        mysticalElement.userData = {
            type: 'mysticalElement',
            floatPhase: Math.random() * Math.PI,
            rotationSpeed: 0.002 + Math.random() * 0.003,
            originalScale: 1,
            originalY: 0,
            elementType: index % 3
        };
        
        return mysticalElement;
    }
    
    createSimpleAsteroid() {
        const geometry = new THREE.DodecahedronGeometry(1.5 + Math.random());
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x696969,
            shininess: 10
        });
        const asteroid = new THREE.Mesh(geometry, material);
        asteroid.castShadow = true;
        
        asteroid.userData = { 
            type: 'asteroid',
            rotationSpeed: 0.01 + Math.random() * 0.02
        };
        return asteroid;
    }
    
    createSimpleSpaceElement(index) {
        const shapes = [
            () => new THREE.OctahedronGeometry(1),
            () => new THREE.TetrahedronGeometry(1.2),
            () => new THREE.IcosahedronGeometry(0.8)
        ];
        
        const colors = [0x9932CC, 0x4169E1, 0x00CED1];
        
        const geometry = shapes[index % shapes.length]();
        const material = new THREE.MeshPhongMaterial({
            color: colors[index % colors.length],
            transparent: true,
            opacity: 0.7
        });
        
        const spaceElement = new THREE.Mesh(geometry, material);
        spaceElement.castShadow = true;
        
        spaceElement.userData = {
            type: 'spaceElement',
            rotationSpeed: 0.005 + Math.random() * 0.01,
            pulsePhase: Math.random() * Math.PI
        };
        
        return spaceElement;
    }
    
    createSimpleBuilding(index) {
        const height = 8 + Math.random() * 15;
        const geometry = new THREE.BoxGeometry(4, height, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0x696969 });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = height / 2;
        building.castShadow = true;
        
        building.userData = { type: 'building' };
        return building;
    }
    
    createSimpleStreetElement(index) {
        if (index % 2 === 0) {
            // Street light
            const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6);
            const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.y = 3;
            
            pole.userData = { type: 'streetLight' };
            return pole;
        } else {
            // Simple decoration
            const geometry = new THREE.BoxGeometry(1, 0.5, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
            const element = new THREE.Mesh(geometry, material);
            element.position.y = 0.25;
            
            element.userData = { type: 'streetElement' };
            return element;
        }
    }
    
    createMysticalForestElements() {
        // Create beautiful mystical forest elements
        const mysticalShapes = [
            // Crystals
            () => new THREE.OctahedronGeometry(1 + Math.random() * 0.5),
            // Mushrooms
            () => {
                const group = new THREE.Group();
                const stem = new THREE.CylinderGeometry(0.1, 0.15, 1.5);
                const cap = new THREE.SphereGeometry(0.8, 8, 4);
                const stemMesh = new THREE.Mesh(stem, new THREE.MeshPhongMaterial({color: 0xF5DEB3}));
                const capMesh = new THREE.Mesh(cap, new THREE.MeshPhongMaterial({color: 0x8B4513}));
                capMesh.position.y = 1.2;
                capMesh.scale.y = 0.5;
                group.add(stemMesh);
                group.add(capMesh);
                return group;
            },
            // Mystical totems
            () => new THREE.ConeGeometry(0.8 + Math.random() * 0.5, 2 + Math.random(), 6),
            // Forest spirits (dodecahedrons)
            () => new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.4),
        ];
        
        const mysticalColors = [0x228B22, 0x32CD32, 0x90EE90, 0x8B4513, 0x2E8B57, 0x9ACD32, 0x006400];
        
        for (let i = 0; i < 12; i++) {
            const shapeFunction = mysticalShapes[Math.floor(Math.random() * mysticalShapes.length)];
            const geometry = shapeFunction();
            
            let mysticalElement;
            
            if (geometry.type === 'Group') {
                mysticalElement = geometry;
            } else {
                const material = new THREE.MeshPhongMaterial({
                    color: mysticalColors[Math.floor(Math.random() * mysticalColors.length)],
                    transparent: true,
                    opacity: 0.7 + Math.random() * 0.3,
                    shininess: 50 + Math.random() * 50
                });
                mysticalElement = new THREE.Mesh(geometry, material);
            }
            
            const angle = (i / 12) * Math.PI * 2;
            const radius = 30 + Math.random() * 25;
            
            mysticalElement.position.set(
                Math.cos(angle) * radius,
                Math.random() * 4,
                Math.sin(angle) * radius
            );
            
            mysticalElement.rotation.x = Math.random() * Math.PI * 0.3;
            mysticalElement.rotation.y = Math.random() * Math.PI * 2;
            mysticalElement.rotation.z = Math.random() * Math.PI * 0.3;
            
            mysticalElement.castShadow = true;
            mysticalElement.receiveShadow = true;
            
            mysticalElement.userData = {
                type: 'mysticalElement',
                floatPhase: Math.random() * Math.PI,
                rotationSpeed: 0.001 + Math.random() * 0.003,
                originalScale: 1,
                originalY: mysticalElement.position.y,
                elementType: i % mysticalShapes.length
            };
            
            this.environmentObjects.push(mysticalElement);
            this.scene.add(mysticalElement);
        }
    }
    
    async createSpaceEnvironment() {
        // Create simplified space elements
        
        // Create a few asteroids
        for (let i = 0; i < 6; i++) {
            const asteroid = this.createSimpleAsteroid();
            const angle = (i / 6) * Math.PI * 2;
            const radius = 35 + Math.random() * 20;
            asteroid.position.set(
                Math.cos(angle) * radius,
                Math.random() * 10 - 5,
                Math.sin(angle) * radius
            );
            this.environmentObjects.push(asteroid);
            this.scene.add(asteroid);
        }
        
        // Create a few space elements
        for (let i = 0; i < 4; i++) {
            const spaceElement = this.createSimpleSpaceElement(i);
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const radius = 45 + Math.random() * 15;
            spaceElement.position.set(
                Math.cos(angle) * radius,
                5 + Math.random() * 10,
                Math.sin(angle) * radius
            );
            this.environmentObjects.push(spaceElement);
            this.scene.add(spaceElement);
        }
        
        return Promise.resolve();
    }
    
    async createCityEnvironment() {
        // Create simplified city elements
        
        // Create a few buildings
        for (let i = 0; i < 8; i++) {
            const building = this.createSimpleBuilding(i);
            const angle = (i / 8) * Math.PI * 2;
            const radius = 40 + Math.random() * 10;
            building.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            this.environmentObjects.push(building);
            this.scene.add(building);
        }
        
        // Create a few street elements
        for (let i = 0; i < 6; i++) {
            const streetElement = this.createSimpleStreetElement(i);
            const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
            const radius = 25 + Math.random() * 5;
            streetElement.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            this.environmentObjects.push(streetElement);
            this.scene.add(streetElement);
        }
        
        return Promise.resolve();
    }
    
    createTree() {
        const tree = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 4;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(4, 8, 6);
        const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 10;
        foliage.castShadow = true;
        tree.add(foliage);
        
        tree.userData = { type: 'tree', swayPhase: Math.random() * Math.PI };
        return tree;
    }
    
    createBush() {
        const bush = new THREE.Group();
        
        const bushGeometry = new THREE.SphereGeometry(1.5, 6, 4);
        const bushMaterial = new THREE.MeshPhongMaterial({ color: 0x32CD32 });
        const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
        bushMesh.position.y = 1.5;
        bushMesh.scale.y = 0.7;
        bushMesh.castShadow = true;
        bush.add(bushMesh);
        
        bush.userData = { type: 'bush' };
        return bush;
    }
    
    createGrass() {
        const grass = new THREE.Group();
        
        const grassGeometry = new THREE.PlaneGeometry(2, 0.5);
        const grassMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x90EE90, 
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(grassGeometry, grassMaterial);
            blade.rotation.x = -Math.PI / 2;
            blade.rotation.z = (i / 3) * Math.PI * 2;
            blade.position.y = 0.1;
            grass.add(blade);
        }
        
        grass.userData = { type: 'grass' };
        return grass;
    }
    
    createAsteroid() {
        const asteroidGeometry = new THREE.DodecahedronGeometry(2 + Math.random() * 3);
        const asteroidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x696969,
            shininess: 10
        });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.castShadow = true;
        
        asteroid.userData = { 
            type: 'asteroid',
            rotationSpeed: 0.01 + Math.random() * 0.02
        };
        return asteroid;
    }
    
    createSatellite() {
        const satellite = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        satellite.add(body);
        
        // Solar panels
        const panelGeometry = new THREE.PlaneGeometry(4, 1);
        const panelMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00CED1,
            transparent: true,
            opacity: 0.8
        });
        
        const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel1.position.x = -3;
        satellite.add(panel1);
        
        const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel2.position.x = 3;
        satellite.add(panel2);
        
        satellite.userData = { 
            type: 'satellite',
            rotationSpeed: 0.005 + Math.random() * 0.01
        };
        return satellite;
    }
    
    createNebula() {
        const nebulaGeometry = new THREE.SphereGeometry(8, 6, 4);
        const nebulaMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x9932CC,
            transparent: true,
            opacity: 0.3
        });
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        
        nebula.userData = { 
            type: 'nebula',
            pulsePhase: Math.random() * Math.PI
        };
        return nebula;
    }
    
    createBuilding() {
        const building = new THREE.Group();
        
        const height = 15 + Math.random() * 25;
        const buildingGeometry = new THREE.BoxGeometry(6, height, 6);
        const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.y = height / 2;
        buildingMesh.castShadow = true;
        building.add(buildingMesh);
        
        // Windows
        for (let i = 0; i < Math.floor(height / 3); i++) {
            for (let j = 0; j < 2; j++) {
                const windowGeometry = new THREE.PlaneGeometry(0.8, 0.8);
                const windowMaterial = new THREE.MeshBasicMaterial({ 
                    color: Math.random() > 0.3 ? 0xFFD700 : 0x000000
                });
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(-2 + j * 4, 2 + i * 3, 3.01);
                building.add(window);
            }
        }
        
        building.userData = { type: 'building' };
        return building;
    }
    
    createStreetLight() {
        const streetLight = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8);
        const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 4;
        streetLight.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.5);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = 8;
        streetLight.add(light);
        
        streetLight.userData = { type: 'streetLight' };
        return streetLight;
    }
    
    createRoadElement() {
        const roadGeometry = new THREE.PlaneGeometry(4, 1);
        const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.y = 0.05;
        
        road.userData = { type: 'road' };
        return road;
    }
    
    async createStageEffects() {
        // Simplified particles - much fewer for better performance
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const themeColors = [
            new THREE.Color(0x4ecdc4),
            new THREE.Color(0x45b7d1),
            new THREE.Color(0x96ceb4)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = Math.random() * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
            
            const colorIndex = Math.floor(Math.random() * themeColors.length);
            const color = themeColors[colorIndex];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
        
        return Promise.resolve();
    }
    
    setupControls() {
        this.switchTheme.addEventListener('click', () => {
            this.switchBusinessTheme();
        });
    }
    
    switchBusinessTheme() {
        this.currentTheme = (this.currentTheme + 1) % this.themes.length;
        const theme = this.themes[this.currentTheme];
        
        // Dramatic background and environment changes
        this.renderer.setClearColor(theme.bgColor, 1);
        this.scene.fog.color.setHex(theme.fogColor);
        
        // CHANGE THE ENVIRONMENT (lazy loading)
        if (this.currentEnvironment !== theme.environment) {
            this.createEnvironment(theme.environment);
        }
        
        // Update stage color dramatically
        if (this.stage) {
            this.stage.material.color.setHex(theme.stageColor);
            // Add pulsing effect to stage
            this.stage.material.emissive.setHex(theme.colors[0]);
            this.stage.material.emissiveIntensity = 0.1;
        }
        
        // Update code blocks with dramatic color changes and effects
        this.codeBlocks.forEach((block, index) => {
            const newColor = theme.colors[index % theme.colors.length];
            block.children.forEach(child => {
                if (child.material) {
                    child.material.color.setHex(newColor);
                    // Add emissive glow
                    child.material.emissive.setHex(newColor);
                    child.material.emissiveIntensity = 0.15;
                    // Add material type change for more variety
                    child.material.shininess = 100 + Math.random() * 100;
                }
            });
            // Add dramatic scaling effect
            const originalScale = block.scale.x;
            block.scale.setScalar(originalScale * 1.2);
            setTimeout(() => {
                block.scale.setScalar(originalScale);
            }, 300);
        });
        
        // Update digital elements with dramatic transformations
        this.digitalElements.forEach((element, index) => {
            const newColor = theme.colors[index % theme.colors.length];
            element.material.color.setHex(newColor);
            element.material.emissive.setHex(newColor);
            element.material.emissiveIntensity = 0.2;
            
            // Add bounce effect
            const originalY = element.userData.originalPosition.y;
            element.position.y = originalY + 3;
            const bounceDown = () => {
                element.position.y = originalY;
            };
            setTimeout(bounceDown, 200);
            
            // Change material properties for variety
            element.material.shininess = 150 + Math.random() * 100;
            if (Math.random() > 0.5) {
                element.material.wireframe = true;
                setTimeout(() => {
                    element.material.wireframe = false;
                }, 1000);
            }
        });
        
        // Update data flows with dramatic effects
        this.dataFlows.forEach((flow, index) => {
            const colorIndex = index % theme.colors.length;
            flow.material.color.setHex(theme.colors[colorIndex]);
            flow.material.emissive.setHex(theme.colors[colorIndex]);
            flow.material.emissiveIntensity = 0.3;
            
            // Add flowing animation reset
            flow.material.opacity = 1.0;
            setTimeout(() => {
                flow.material.opacity = 0.6;
            }, 500);
        });
        
        // Update particles with new theme colors
        if (this.particles) {
            const colors = this.particles.geometry.attributes.color.array;
            const themeColors = theme.particleColors.map(hex => new THREE.Color(hex));
            
            for (let i = 0; i < colors.length; i += 3) {
                const colorIndex = Math.floor((i / 3) % themeColors.length);
                const color = themeColors[colorIndex];
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
            this.particles.geometry.attributes.color.needsUpdate = true;
            
            // Add particle explosion effect
            const positions = this.particles.geometry.attributes.position.array;
            const originalPositions = [...positions];
            
            // Explode particles outward
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] *= 1.5; // X
                positions[i + 2] *= 1.5; // Z
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
            
            // Return particles to original positions
            setTimeout(() => {
                for (let i = 0; i < positions.length; i++) {
                    positions[i] = originalPositions[i];
                }
                this.particles.geometry.attributes.position.needsUpdate = true;
            }, 800);
        }
        
        // Update lighting with theme colors and dramatic effects
        this.lights.forEach((light, index) => {
            if (index > 0) { // Skip main directional light
                const themeColorIndex = (index - 1) % theme.colors.length;
                light.color.setHex(theme.colors[themeColorIndex]);
                
                // Add dramatic intensity pulse
                const originalIntensity = light.intensity;
                light.intensity = originalIntensity * 2;
                setTimeout(() => {
                    light.intensity = originalIntensity;
                }, 400);
            }
        });
        
        // Add camera shake effect for more drama
        const originalRadius = this.cameraController.radius;
        const originalHeight = this.cameraController.height;
        
        // Shake camera
        this.cameraController.radius = originalRadius + Math.sin(Date.now() * 0.1) * 2;
        this.cameraController.height = originalHeight + Math.cos(Date.now() * 0.1) * 1;
        
        setTimeout(() => {
            this.cameraController.radius = originalRadius;
            this.cameraController.height = originalHeight;
        }, 600);
        
        // Console log for user feedback
        console.log(`🎨 Switched to ${theme.name} theme!`);
    }
    
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
            this.render();
        };
        animate();
    }
    
    update() {
        if (!this.isPlaying) return;
        
        this.time += 0.016; // ~60fps
        
        this.updateCodeBlocks();
        this.updateDataFlows();
        this.updateDigitalElements();
        this.updateEnvironmentObjects();
        this.updateCamera();
        this.updateLighting();
        this.updateParticles();
    }
    
    updateCodeBlocks() {
        this.codeBlocks.forEach((block, index) => {
            const userData = block.userData;
            const phase = this.time + userData.animationPhase;
            
            // Gentle floating animation
            block.position.y = userData.originalPosition.y + Math.sin(phase * 0.8) * 0.5;
            
            // Subtle rotation for code blocks
            block.rotation.y = Math.sin(phase * 0.5) * 0.1;
            block.rotation.x = Math.cos(phase * 0.3) * 0.05;
            
            // Pulsing opacity based on "development activity"
            const opacity = 0.7 + Math.sin(phase * 2) * 0.2;
            block.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = Math.max(0.5, opacity);
                }
            });
        });
    }
    
    updateDataFlows() {
        this.dataFlows.forEach((flow, index) => {
            const userData = flow.userData;
            const phase = this.time * userData.animationSpeed + userData.phaseOffset;
            
            // Animated opacity to simulate data flow
            flow.material.opacity = 0.3 + Math.sin(phase * 3) * 0.3;
            flow.material.emissiveIntensity = 0.1 + Math.sin(phase * 2) * 0.1;
            
            // Gentle rotation
            flow.rotation.z = Math.sin(phase * 0.5) * 0.1;
        });
    }
    
    updateDigitalElements() {
        this.digitalElements.forEach((element, index) => {
            const userData = element.userData;
            const phase = this.time + (index * 0.5);
            
            // Continuous rotation based on type
            element.rotation.x += userData.rotationSpeed * 0.01;
            element.rotation.y += userData.rotationSpeed * 0.008;
            element.rotation.z += userData.rotationSpeed * 0.005;
            
            // Floating motion
            element.position.y = userData.originalPosition.y + Math.sin(phase * 0.7) * 0.8;
            
            // Scale pulsing for emphasis
            const scale = 1 + Math.sin(phase * 1.2) * 0.1;
            element.scale.set(scale, scale, scale);
        });
    }
    
    updateEnvironmentObjects() {
        this.environmentObjects.forEach((obj, index) => {
            const userData = obj.userData;
            const phase = this.time + (index * 0.1);
            
            switch(userData.type) {
                case 'tree':
                    // Trees sway in the wind
                    obj.rotation.z = Math.sin(phase + userData.swayPhase) * 0.1;
                    break;
                    
                case 'bush':
                    // Bushes have subtle movement
                    obj.scale.y = 0.7 + Math.sin(phase * 2) * 0.05;
                    break;
                    
                case 'grass':
                    // Grass waves gently
                    obj.rotation.y = Math.sin(phase * 3) * 0.2;
                    break;
                    
                case 'mysticalElement':
                    // Mystical elements have unique behaviors based on type
                    obj.position.y = userData.originalY + Math.sin(phase + userData.floatPhase) * 0.8;
                    
                    switch(userData.elementType) {
                        case 0: // Crystals - spin and glow
                            obj.rotation.x += userData.rotationSpeed * 2;
                            obj.rotation.y += userData.rotationSpeed * 1.5;
                            obj.rotation.z += userData.rotationSpeed;
                            if (obj.material) {
                                obj.material.opacity = 0.7 + Math.sin(phase * 4 + userData.floatPhase) * 0.3;
                                obj.material.emissive.setHex(0x004400);
                                obj.material.emissiveIntensity = Math.sin(phase * 3) * 0.2;
                            }
                            break;
                            
                        case 1: // Mushrooms - gentle sway
                            obj.rotation.z = Math.sin(phase + userData.floatPhase) * 0.1;
                            obj.children.forEach(child => {
                                if (child.material) {
                                    child.material.opacity = 0.8 + Math.sin(phase * 2) * 0.2;
                                }
                            });
                            break;
                            
                        case 2: // Totems - steady rotation
                            obj.rotation.y += userData.rotationSpeed;
                            if (obj.material) {
                                obj.material.opacity = 0.6 + Math.sin(phase * 2 + userData.floatPhase) * 0.4;
                            }
                            break;
                            
                        case 3: // Forest spirits - erratic movement
                            obj.rotation.x += userData.rotationSpeed * 0.5;
                            obj.rotation.y += userData.rotationSpeed * 1.2;
                            obj.rotation.z += userData.rotationSpeed * 0.8;
                            const spiritScale = 1 + Math.sin(phase * 3 + userData.floatPhase) * 0.15;
                            obj.scale.set(spiritScale, spiritScale, spiritScale);
                            if (obj.material) {
                                obj.material.opacity = 0.5 + Math.sin(phase * 5 + userData.floatPhase) * 0.4;
                            }
                            break;
                    }
                    break;
                    
                case 'asteroid':
                    // Asteroids rotate
                    obj.rotation.x += userData.rotationSpeed;
                    obj.rotation.y += userData.rotationSpeed * 0.7;
                    obj.rotation.z += userData.rotationSpeed * 0.5;
                    break;
                    
                case 'satellite':
                    // Satellites orbit and rotate
                    obj.rotation.y += userData.rotationSpeed;
                    obj.position.y = obj.position.y + Math.sin(phase) * 0.2;
                    break;
                    
                case 'nebula':
                    // Nebulas pulse and drift
                    const pulseIntensity = 0.3 + Math.sin(phase + userData.pulsePhase) * 0.1;
                    obj.material.opacity = pulseIntensity;
                    obj.rotation.y += 0.002;
                    break;
                    
                case 'building':
                    // Buildings have subtle light flickering in windows
                    obj.children.forEach(child => {
                        if (child.material && child.material.color.getHex() === 0xFFD700) {
                            child.material.opacity = 0.8 + Math.sin(phase * 4 + index) * 0.2;
                        }
                    });
                    break;
                    
                case 'streetLight':
                    // Street lights flicker subtly
                    const light = obj.children.find(child => child.material && child.material.color.getHex() === 0xFFD700);
                    if (light) {
                        light.material.opacity = 0.9 + Math.sin(phase * 6) * 0.1;
                    }
                    break;
            }
        });
    }
    
    updateCamera() {
        if (this.cameraController.autoRotate && this.isPlaying) {
            this.cameraController.angle += 0.002; // Slower rotation for business feel
        }
        
        const x = Math.cos(this.cameraController.angle) * this.cameraController.radius;
        const z = Math.sin(this.cameraController.angle) * this.cameraController.radius;
        
        this.camera.position.set(x, this.cameraController.height, z);
        this.camera.lookAt(0, 5, 0); // Look slightly higher for better view of elements
    }
    
    updateLighting() {
        // Subtle light movement for dynamic feel
        this.lights.forEach((light, index) => {
            if (index > 0) { // Skip main directional light
                const time = this.time + index * Math.PI * 0.5;
                light.intensity = 0.6 + Math.sin(time * 0.3) * 0.2;
            }
        });
    }
    
    updateParticles() {
        if (this.particles) {
            // Rotate particle system slowly
            this.particles.rotation.y += 0.0005;
            
            // Animate individual particles
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(this.time + i) * 0.01; // Y movement
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
}

// Initialize the 3D business visualization
const nfinityInfotech3D = new NfinityInfotech3D();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add scroll animation to service cards and features
document.querySelectorAll('.service-card, .feature, .tech-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});