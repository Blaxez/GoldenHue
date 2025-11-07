
        // ===== APPLICATION INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', () => {
            // Main palette data structure (array of color objects)
            let palette = [];
            
            // Cache all DOM element references for performance
            const elements = {
                body: document.body,
                colorPicker: document.getElementById('colorPicker'),
                hexInput: document.getElementById('hexInput'),
                countInput: document.getElementById('countInput'),
                harmonyMode: document.getElementById('harmonyMode'),
                saturationRange: document.getElementById('saturationRange'),
                lightnessRange: document.getElementById('lightnessRange'),
                saturationValue: document.getElementById('saturationValue'),
                lightnessValue: document.getElementById('lightnessValue'),
                generateBtn: document.getElementById('generateBtn'),
                randomizeBtn: document.getElementById('randomizeBtn'),
                paletteGrid: document.getElementById('paletteGrid'),
                themeToggle: document.getElementById('themeToggle'),
                themeIcon: document.getElementById('themeIcon'),
                themeText: document.getElementById('themeText'),
                toast: document.getElementById('toast'),
                shareBtn: document.getElementById('shareBtn'),
                exportBtn: document.getElementById('exportBtn'),
                previewGrid: document.getElementById('previewGrid')
            };
            
            // ===== COLOR NAME DATABASE =====
            // Comprehensive list of named colors for friendly color identification
            const colorNameList = {
                "#f0f8ff":"alice blue","#faebd7":"antique white","#00ffff":"aqua","#7fffd4":"aquamarine",
                "#f0ffff":"azure","#f5f5dc":"beige","#ffe4c4":"bisque","#000000":"black",
                "#ffebcd":"blanched almond","#0000ff":"blue","#8a2be2":"blue violet","#a52a2a":"brown",
                "#deb887":"burly wood","#5f9ea0":"cadet blue","#7fff00":"chartreuse","#d2691e":"chocolate",
                "#ff7f50":"coral","#6495ed":"cornflower blue","#fff8dc":"cornsilk","#dc143c":"crimson",
                "#00ffff":"cyan","#00008b":"dark blue","#008b8b":"dark cyan","#b8860b":"dark goldenrod",
                "#a9a9a9":"dark gray","#006400":"dark green","#bdb76b":"dark khaki","#8b008b":"dark magenta",
                "#556b2f":"dark olive green","#ff8c00":"dark orange","#9932cc":"dark orchid","#8b0000":"dark red",
                "#e9967a":"dark salmon","#8fbc8f":"dark sea green","#483d8b":"dark slate blue","#2f4f4f":"dark slate gray",
                "#00ced1":"dark turquoise","#9400d3":"dark violet","#ff1493":"deep pink","#00bfff":"deep sky blue",
                "#696969":"dim gray","#1e90ff":"dodger blue","#b22222":"firebrick","#fffaf0":"floral white",
                "#228b22":"forest green","#ff00ff":"fuchsia","#dcdcdc":"gainsboro","#f8f8ff":"ghost white",
                "#ffd700":"gold","#daa520":"goldenrod","#808080":"gray","#008000":"green",
                "#adff2f":"green yellow","#f0fff0":"honeydew","#ff69b4":"hot pink","#cd5c5c":"indian red",
                "#4b0082":"indigo","#fffff0":"ivory","#f0e68c":"khaki","#e6e6fa":"lavender",
                "#fff0f5":"lavender blush","#7cfc00":"lawn green","#fffacd":"lemon chiffon","#add8e6":"light blue",
                "#f08080":"light coral","#e0ffff":"light cyan","#fafad2":"light goldenrod yellow","#d3d3d3":"light gray",
                "#90ee90":"light green","#ffb6c1":"light pink","#ffa07a":"light salmon","#20b2aa":"light sea green",
                "#87cefa":"light sky blue","#778899":"light slate gray","#b0c4de":"light steel blue","#ffffe0":"light yellow",
                "#00ff00":"lime","#32cd32":"lime green","#faf0e6":"linen","#ff00ff":"magenta",
                "#800000":"maroon","#66cdaa":"medium aquamarine","#0000cd":"medium blue","#ba55d3":"medium orchid",
                "#9370db":"medium purple","#3cb371":"medium sea green","#7b68ee":"medium slate blue","#00fa9a":"medium spring green",
                "#48d1cc":"medium turquoise","#c71585":"medium violet red","#191970":"midnight blue","#f5fffa":"mint cream",
                "#ffe4e1":"misty rose","#ffe4b5":"moccasin","#ffdead":"navajo white","#000080":"navy",
                "#fdf5e6":"old lace","#808000":"olive","#6b8e23":"olive drab","#ffa500":"orange",
                "#ff4500":"orange red","#da70d6":"orchid","#eee8aa":"pale goldenrod","#98fb98":"pale green",
                "#afeeee":"pale turquoise","#db7093":"pale violet red","#ffefd5":"papaya whip","#ffdab9":"peach puff",
                "#cd853f":"peru","#ffc0cb":"pink","#dda0dd":"plum","#b0e0e6":"powder blue",
                "#800080":"purple","#663399":"rebecca purple","#ff0000":"red","#bc8f8f":"rosy brown",
                "#4169e1":"royal blue","#8b4513":"saddle brown","#fa8072":"salmon","#f4a460":"sandy brown",
                "#2e8b57":"sea green","#fff5ee":"sea shell","#a0522d":"sienna","#c0c0c0":"silver",
                "#87ceeb":"sky blue","#6a5acd":"slate blue","#708090":"slate gray","#fffafa":"snow",
                "#00ff7f":"spring green","#4682b4":"steel blue","#d2b48c":"tan","#008080":"teal",
                "#d8bfd8":"thistle","#ff6347":"tomato","#40e0d0":"turquoise","#ee82ee":"violet",
                "#f5deb3":"wheat","#ffffff":"white","#f5f5f5":"white smoke","#ffff00":"yellow",
                "#9acd32":"yellow green"
            };
            
            // Pre-compute RGB values for color name matching performance
            const hexCache = Object.keys(colorNameList).map(hex => hexToRgb(hex));

            // ===== COLOR CONVERSION UTILITIES =====
            
            /**
             * Convert hexadecimal color to RGB object
             * @param {string} hex - Hex color string (e.g., "#FF5733")
             * @returns {object} RGB object with r, g, b properties (0-255)
             */
            function hexToRgb(hex) {
                const bigint = parseInt(hex.slice(1), 16);
                return {
                    r: (bigint >> 16) & 255,
                    g: (bigint >> 8) & 255,
                    b: bigint & 255
                };
            }

            /**
             * Convert RGB object to hexadecimal color string
             * @param {object} rgb - RGB object with r, g, b properties
             * @returns {string} Hex color string
             */
            function rgbToHex({ r, g, b }) {
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
            }

            /**
             * Convert RGB to HSL color space
             * @param {object} rgb - RGB object with r, g, b properties (0-255)
             * @returns {object} HSL object with h (0-360), s (0-100), l (0-100)
             */
            function rgbToHsl({ r, g, b }) {
                r /= 255;
                g /= 255;
                b /= 255;
                
                const cmin = Math.min(r, g, b);
                const cmax = Math.max(r, g, b);
                const delta = cmax - cmin;
                let h = 0, s = 0, l = (cmax + cmin) / 2;
                
                if (delta !== 0) {
                    if (cmax === r) h = ((g - b) / delta) % 6;
                    else if (cmax === g) h = (b - r) / delta + 2;
                    else h = (r - g) / delta + 4;
                    
                    h = Math.round(h * 60);
                    if (h < 0) h += 360;
                    
                    s = delta / (1 - Math.abs(2 * l - 1));
                }
                
                return {
                    h: h,
                    s: Math.round(s * 100),
                    l: Math.round(l * 100)
                };
            }
            
            /**
             * Convert HSL to RGB color space
             * @param {object} hsl - HSL object with h, s, l properties
             * @returns {object} RGB object with r, g, b properties (0-255)
             */
            function hslToRgb({ h, s, l }) {
                s /= 100;
                l /= 100;
                
                const c = (1 - Math.abs(2 * l - 1)) * s;
                const x = c * (1 - Math.abs((h / 60) % 2 - 1));
                const m = l - c / 2;
                let r = 0, g = 0, b = 0;
                
                if (0 <= h && h < 60) { r = c; g = x; }
                else if (h < 120) { r = x; g = c; }
                else if (h < 180) { g = c; b = x; }
                else if (h < 240) { g = x; b = c; }
                else if (h < 300) { r = x; b = c; }
                else { r = c; b = x; }
                
                return {
                    r: Math.round((r + m) * 255),
                    g: Math.round((g + m) * 255),
                    b: Math.round((b + m) * 255)
                };
            }

            /**
             * Determine best contrast color (black or white) for text on given background
             * @param {string} hex - Background hex color
             * @returns {string} "#000000" or "#FFFFFF"
             */
            function getContrastColor(hex) {
                const { r, g, b } = hexToRgb(hex);
                // Calculate relative luminance using WCAG formula
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                return luminance > 0.5 ? '#000000' : '#ffffff';
            }

            /**
             * Find closest named color to given hex value
             * Uses Euclidean distance in RGB space
             * @param {string} hex - Hex color to find name for
             * @returns {string} Closest color name
             */
            function getClosestColorName(hex) {
                const rgb = hexToRgb(hex);
                let minDistance = Infinity;
                let closestIndex = -1;
                
                for (let i = 0; i < hexCache.length; i++) {
                    const d = Math.sqrt(
                        Math.pow(rgb.r - hexCache[i].r, 2) +
                        Math.pow(rgb.g - hexCache[i].g, 2) +
                        Math.pow(rgb.b - hexCache[i].b, 2)
                    );
                    if (d < minDistance) {
                        minDistance = d;
                        closestIndex = i;
                    }
                }
                
                return colorNameList[Object.keys(colorNameList)[closestIndex]];
            }

            // ===== PALETTE GENERATION LOGIC =====
            
            /**
             * Generate a complete color palette based on user settings
             * Respects locked colors and applies selected harmony mode
             */
            function generatePalette() {
                const baseHex = elements.colorPicker.value;
                const count = parseInt(elements.countInput.value);
                const mode = elements.harmonyMode.value;
                const satVar = parseInt(elements.saturationRange.value);
                const lightVar = parseInt(elements.lightnessRange.value);
                
                // Convert base color to HSL for harmony calculations
                const baseHsl = rgbToHsl(hexToRgb(baseHex));
                
                // Keep locked colors and calculate how many new colors to generate
                const newPalette = palette.filter(c => c.locked);
                const remainingCount = count - newPalette.length;

                // Generate colors based on selected harmony mode
                for (let i = 0; i < remainingCount; i++) {
                    let hsl;
                    
                    switch (mode) {
                        case 'golden-angle':
                            // Golden angle (137.5°) creates aesthetically pleasing distributions
                            hsl = {
                                h: (baseHsl.h + i * 137.5) % 360,
                                s: baseHsl.s,
                                l: baseHsl.l
                            };
                            break;
                            
                        case 'analogous':
                            // Colors adjacent on color wheel (±30° increments)
                            hsl = {
                                h: (baseHsl.h + (i - Math.floor(remainingCount / 2)) * 30 + 360) % 360,
                                s: baseHsl.s,
                                l: baseHsl.l
                            };
                            break;
                            
                        case 'complementary':
                            // Opposite colors on wheel (180° apart)
                            hsl = {
                                h: (baseHsl.h + (i % 2) * 180) % 360,
                                s: baseHsl.s,
                                l: baseHsl.l
                            };
                            break;
                            
                        case 'triadic':
                            // Three colors evenly spaced (120° apart)
                            hsl = {
                                h: (baseHsl.h + i * 120) % 360,
                                s: baseHsl.s,
                                l: baseHsl.l
                            };
                            break;
                            
                        case 'tetradic':
                            // Four colors evenly spaced (90° apart)
                            hsl = {
                                h: (baseHsl.h + i * 90) % 360,
                                s: baseHsl.s,
                                l: baseHsl.l
                            };
                            break;
                            
                        case 'monochromatic':
                            // Same hue, varying lightness
                            hsl = {
                                h: baseHsl.h,
                                s: baseHsl.s,
                                l: Math.min(100, Math.max(10, baseHsl.l - (i * (80 / remainingCount)) + 40))
                            };
                            break;
                    }
                    
                    // Apply random variance to saturation and lightness
                    hsl.s = Math.max(0, Math.min(100, hsl.s + (Math.random() - 0.5) * 2 * satVar));
                    hsl.l = Math.max(0, Math.min(100, hsl.l + (Math.random() - 0.5) * 2 * lightVar));
                    
                    // Convert back to hex
                    const hex = rgbToHex(hslToRgb(hsl));
                    
                    // Avoid duplicate colors
                    if (!newPalette.find(c => c.hex === hex)) {
                        newPalette.push({
                            id: Date.now() + i,
                            hex,
                            locked: false
                        });
                    }
                }
                
                // Update global palette and re-render
                palette = newPalette.slice(0, count);
                renderPalette();
                showToast('✨ New palette generated!');
            }

            /**
             * Randomize only unlocked colors in current palette
             */
            function randomizePalette() {
                palette.forEach(color => {
                    if (!color.locked) {
                        // Generate random HSL values
                        const hsl = {
                            h: Math.random() * 360,
                            s: 40 + Math.random() * 60,
                            l: 30 + Math.random() * 50
                        };
                        color.hex = rgbToHex(hslToRgb(hsl));
                    }
                });
                renderPalette();
                showToast('🎲 Colors randomized!');
            }

            /**
             * Render the palette grid with all color cards
             * Creates interactive cards with lock, copy, and color info
             */
            function renderPalette() {
                elements.paletteGrid.innerHTML = '';
                
                palette.forEach((color, index) => {
                    const card = document.createElement('div');
                    card.className = `color-card ${color.locked ? 'locked' : ''}`;
                    card.dataset.id = color.id;
                    
                    // Get friendly color name
                    const colorName = getClosestColorName(color.hex);
                    
                    // Get RGB and HSL values for display
                    const rgb = hexToRgb(color.hex);
                    const hsl = rgbToHsl(rgb);
                    
                    // Build card HTML structure
                    card.innerHTML = `
                        <div class="color-swatch" style="background-color: ${color.hex}" 
                             title="Click to copy ${color.hex}"></div>
                        <div class="color-info">
                            <div class="color-header">
                                <span class="color-name">${colorName}</span>
                                <button class="card-icon-btn lock-btn" data-index="${index}" 
                                        title="${color.locked ? 'Unlock' : 'Lock'} color"
                                        aria-label="${color.locked ? 'Unlock' : 'Lock'} color">
                                    <i class="fas ${color.locked ? 'fa-lock' : 'fa-lock-open'}"></i>
                                </button>
                            </div>
                            <div class="color-values">
                                <div class="color-value">
                                    <span class="color-label">HEX</span> 
                                    <span>${color.hex}</span>
                                </div>
                                <div class="color-value">
                                    <span class="color-label">RGB</span> 
                                    <span>${rgb.r}, ${rgb.g}, ${rgb.b}</span>
                                </div>
                                <div class="color-value">
                                    <span class="color-label">HSL</span> 
                                    <span>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</span>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Add click handler for copying hex value
                    card.querySelector('.color-swatch').addEventListener('click', () => {
                        copyToClipboard(color.hex);
                    });
                    
                    // Add click handler for lock button
                    card.querySelector('.lock-btn').addEventListener('click', () => {
                        color.locked = !color.locked;
                        renderPalette();
                    });
                    
                    elements.paletteGrid.appendChild(card);
                });
                
                // Update live previews with new colors
                updateLivePreviews();
            }
            
            /**
             * Update all live preview mockups with current palette colors
             * Intelligently assigns colors based on common UI patterns
             */
            function updateLivePreviews() {
                if (palette.length === 0) return;
                
                // Sort colors by lightness for smart assignment
                const sortedByLightness = [...palette].sort((a, b) => 
                    rgbToHsl(hexToRgb(a.hex)).l - rgbToHsl(hexToRgb(b.hex)).l
                );
                
                // Identify darkest and lightest colors for text
                const textDark = sortedByLightness[0].hex;
                const textLight = sortedByLightness[sortedByLightness.length - 1].hex;

                // Assign colors to UI elements
                const primary = palette[0] ? palette[0].hex : '#667eea';
                const secondary = palette[1] ? palette[1].hex : '#f093fb';
                const card = palette[3] ? palette[3].hex : 
                            (elements.body.dataset.theme === 'dark' ? '#1e2530' : '#ffffff');
                const bg = palette[4] ? palette[4].hex : 
                           (elements.body.dataset.theme === 'dark' ? '#0d1117' : '#f8f9fa');
                
                // Determine text color based on background
                const textOnBg = getContrastColor(bg) === '#000000' ? textDark : textLight;
                const textSecondary = textOnBg === textDark ? textLight : textDark;

                // Apply colors to preview CSS variables
                const style = elements.previewGrid.style;
                style.setProperty('--preview-primary', primary);
                style.setProperty('--preview-secondary', secondary);
                style.setProperty('--preview-card', card);
                style.setProperty('--preview-bg', bg);
                style.setProperty('--preview-text', textOnBg);
                style.setProperty('--preview-text-secondary', textSecondary);
                style.setProperty('--preview-text-on-primary', getContrastColor(primary));
                style.setProperty('--preview-border', textSecondary);
            }

            // ===== THEME MANAGEMENT =====
            
            /**
             * Toggle between light and dark neumorphic themes
             * Persists preference to localStorage
             */
            function toggleTheme() {
                const currentTheme = elements.body.dataset.theme === 'dark' ? 'light' : 'dark';
                elements.body.dataset.theme = currentTheme;
                
                // Update theme toggle button
                elements.themeIcon.innerHTML = currentTheme === 'dark' ? 
                    '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                elements.themeText.textContent = currentTheme === 'dark' ? 
                    'Light Mode' : 'Dark Mode';
                
                // Save preference
                localStorage.setItem('theme', currentTheme);
                
                // Update preview colors for new theme
                updateLivePreviews();
            }

            // ===== SHARING & EXPORT FEATURES =====
            
            /**
             * Generate shareable URL with current palette
             * Encodes hex colors in URL parameters
             */
            function sharePalette() {
                const colorString = palette.map(c => c.hex.slice(1)).join('-');
                const shareUrl = `${window.location.origin}${window.location.pathname}?colors=${colorString}`;
                copyToClipboard(shareUrl, '🔗 Shareable link copied!');
            }
            
            /**
             * Export palette as CSS custom properties
             * Ready to paste into stylesheets
             */
            function exportPalette() {
                const css = `:root {\n${palette.map((c, i) => 
                    `  --color-${i + 1}: ${c.hex};`
                ).join('\n')}\n}`;
                copyToClipboard(css, '📋 CSS variables copied!');
            }

            // ===== UI FEEDBACK UTILITIES =====
            
            /**
             * Display toast notification message
             * @param {string} message - Message to display
             */
            function showToast(message) {
                elements.toast.textContent = message;
                elements.toast.classList.add('show');
                setTimeout(() => {
                    elements.toast.classList.remove('show');
                }, 2500);
            }

            /**
             * Copy text to clipboard and show confirmation
             * @param {string} text - Text to copy
             * @param {string} message - Optional custom toast message
             */
            function copyToClipboard(text, message = `Copied ${text}!`) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast(message);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    showToast('❌ Failed to copy');
                });
            }
            
            // ===== INITIALIZATION =====
            
            /**
             * Initialize application on page load
             * Handles URL parameters, theme restoration, and initial palette generation
             */
            function init() {
                // Check for shared palette in URL
                const params = new URLSearchParams(window.location.search);
                const colors = params.get('colors');
                
                if (colors) {
                    try {
                        // Parse colors from URL
                        palette = colors.split('-').map((hex, i) => ({
                            id: Date.now() + i,
                            hex: `#${hex.toUpperCase()}`,
                            locked: false
                        }));
                        
                        // Update UI with first color
                        elements.colorPicker.value = palette[0].hex;
                        elements.hexInput.value = palette[0].hex;
                        elements.countInput.value = palette.length;
                        
                        // Clean URL
                        history.replaceState(null, '', window.location.pathname);
                    } catch (e) {
                        console.error("Invalid URL parameters:", e);
                        generatePalette();
                    }
                } else {
                    // Generate initial palette
                    generatePalette();
                }
                
                // Restore saved theme preference
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme && savedTheme !== elements.body.dataset.theme) {
                    toggleTheme();
                }

                // Render initial palette
                renderPalette();
            }
            
            // ===== EVENT LISTENERS =====
            
            // Color picker synchronization
            elements.colorPicker.addEventListener('input', (e) => {
                elements.hexInput.value = e.target.value.toUpperCase();
            });
            
            // Hex input validation and synchronization
            elements.hexInput.addEventListener('input', (e) => {
                const value = e.target.value.toUpperCase();
                // Only update if valid hex format
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    elements.colorPicker.value = value;
                }
            });
            
            // Range slider output updates
            ['saturationRange', 'lightnessRange'].forEach(id => {
                const el = document.getElementById(id);
                const out = document.getElementById(id.replace('Range', 'Value'));
                el.addEventListener('input', () => {
                    out.textContent = `${el.value}%`;
                });
            });

            // Main action buttons
            elements.generateBtn.addEventListener('click', generatePalette);
            elements.randomizeBtn.addEventListener('click', randomizePalette);
            elements.themeToggle.addEventListener('click', toggleTheme);
            elements.shareBtn.addEventListener('click', sharePalette);
            elements.exportBtn.addEventListener('click', exportPalette);
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + G: Generate new palette
                if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                    e.preventDefault();
                    generatePalette();
                }
                // Ctrl/Cmd + R: Randomize
                if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                    e.preventDefault();
                    randomizePalette();
                }
                // Ctrl/Cmd + T: Toggle theme
                if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
            
            // Start the application
            init();
        });
    