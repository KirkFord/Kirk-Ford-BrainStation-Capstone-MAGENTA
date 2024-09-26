import React, { useState, useEffect } from 'react';
import './AccessibilityModal.scss';
import '../../styles/_accessibility.scss';

const AccessibilityModal = ({ isOpen, closeModal, settings, setSettings }) => {
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem('accessibilitySettings'));
        if (savedSettings) {
            setSettings(savedSettings);
            applySettings(savedSettings);
        }
    }, []);

    useEffect(() => {
        if (!initialLoad) {
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
            applySettings(settings);
        } else {
            setInitialLoad(false);
        }
    }, [settings]);

    const applySettings = (settings) => {
        // Mouse and Effects
        document.body.style.cursor = settings.cursorOn ? 'default' : 'none';
        document.body.classList.toggle('disable-animations', settings.animationsDisabled);

        // Handle cursor animation visibility
        const pointer1 = document.getElementById('g-pointer-1');
        const pointer2 = document.getElementById('g-pointer-2');
        if (pointer1 && pointer2) {
            pointer1.style.display = settings.cursorAnimationOn ? 'block' : 'none';
            pointer2.style.display = settings.cursorAnimationOn ? 'block' : 'none';
        }

        // Apply fontSize globally
        const defaultFontSize = 16;
        const newFontSize = settings.fontSize ? settings.fontSize / 10 : defaultFontSize;
        document.documentElement.style.fontSize = `${newFontSize}px`;

        // Screen Reader Hints
        const screenReaderElements = document.querySelectorAll('[data-screen-reader-hints]');
        screenReaderElements.forEach(el => el.setAttribute('aria-hidden', settings.screenReaderHints ? 'false' : 'true'));

        // Simplified Mode
        document.body.classList.toggle('simplified-mode', settings.simplifiedMode);

        // Autoplay
        document.querySelectorAll('video, audio').forEach(media => {
            media.autoplay = settings.autoPlayOn;
        });

        // Color Scheme
        document.body.classList.remove('default-scheme', 'colorblind-friendly', 'high-contrast');
        document.body.classList.add(settings.colorScheme);
    };

    const handleSettingChange = (callback) => {
        const modal = document.querySelector('.accessibility-modal');
        const scrollPosition = modal.scrollTop;
        callback();
        setTimeout(() => {
            modal.scrollTop = scrollPosition;
        }, 0);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (isOpen) {
            const modal = document.querySelector('.accessibility-modal');
            if (modal) {
                const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
                const focusableContent = modal.querySelectorAll(focusableElements);
                const lastFocusableElement = focusableContent[focusableContent.length - 1];

                const handleFocusTrap = (e) => {
                    let isTabPressed = e.key === 'Tab';

                    if (!isTabPressed) return;

                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                };

                document.addEventListener('keydown', handleKeyDown);
                document.addEventListener('keydown', handleFocusTrap);
                firstFocusableElement.focus();
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`} aria-modal="true" role="dialog">
            <div className="accessibility-modal show" role="document" aria-labelledby="accessibility-title">
                <div className="modal-header">
                    <h2 id="accessibility-title">Accessibility Settings</h2>
                    <button onClick={closeModal} aria-label="Close accessibility settings">Close</button>
                </div>
                <div className="modal-content">
                    {/* Mouse and Effects Toggle */}
                    <section>
                        <h3>Mouse and Effects</h3>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, cursorOn: !settings.cursorOn })))}
                            aria-label="Toggle Mouse Cursor"
                        >
                            {settings.cursorOn ? 'Turn Cursor Off' : 'Turn Cursor On'}
                        </button>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, animationsDisabled: !settings.animationsDisabled })))}
                            aria-label="Toggle Animations"
                        >
                            {settings.animationsDisabled ? 'Enable Animations' : 'Disable Animations'}
                        </button>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, cursorAnimationOn: !settings.cursorAnimationOn })))}
                            aria-label="Toggle Cursor Animation"
                        >
                            {settings.cursorAnimationOn ? 'Turn Cursor Animation Off' : 'Turn Cursor Animation On'}
                        </button>
                    </section>

                    {/* Text Size and Zoom */}
                    <section>
                        <h3>Text Size and Zoom</h3>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, fontSize: settings.fontSize + 10 })))}
                            aria-label="Increase Font Size"
                        >
                            Increase Font Size
                        </button>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, fontSize: settings.fontSize - 10 })))}
                            aria-label="Decrease Font Size"
                        >
                            Decrease Font Size
                        </button>
                    </section>

                    {/* Screen Reader Compatibility */}
                    <section>
                        <h3>Screen Reader Compatibility</h3>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, screenReaderHints: !settings.screenReaderHints })))}
                            aria-label="Toggle Screen Reader Hints"
                        >
                            {settings.screenReaderHints ? 'Disable Hints' : 'Enable Hints'}
                        </button>
                    </section>

                    {/* Keyboard Navigation */}
                    <section>
                        <h3>Keyboard Navigation</h3>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, keyboardNavigation: !settings.keyboardNavigation })))}
                            aria-label="Toggle Keyboard Navigation"
                        >
                            {settings.keyboardNavigation ? 'Disable' : 'Enable'} Keyboard Navigation
                        </button>
                    </section>

                    {/* Simplified Mode */}
                    <section>
                        <h3>Simplified Mode</h3>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, simplifiedMode: !settings.simplifiedMode, cursorAnimationOn: !settings.cursorAnimationOn })))}
                            aria-label="Toggle Simplified Mode"
                        >
                            {settings.simplifiedMode ? 'Disable Simplified Mode' : 'Enable Simplified Mode'}
                        </button>
                    </section>

                    {/* Auto-Play Media */}
                    <section>
                        <h3>Auto-Play Media</h3>
                        <button
                            onClick={() => handleSettingChange(() => setSettings((prev) => ({ ...prev, autoPlayOn: !settings.autoPlayOn })))}
                            aria-label="Toggle Autoplay"
                        >
                            {settings.autoPlayOn ? 'Turn Off Autoplay' : 'Turn On Autoplay'}
                        </button>
                    </section>

                    {/* Color Scheme */}
                    <section>
                        <h3>Color Scheme</h3>
                        <select
                            onChange={(e) => handleSettingChange(() => setSettings((prev) => ({ ...prev, colorScheme: e.target.value })))}
                            value={settings.colorScheme}
                            aria-label="Color Scheme"
                        >
                            <option value="default-scheme">Default</option>
                            <option value="colorblind-friendly">Colorblind Friendly</option>
                            <option value="high-contrast">High Contrast</option>
                        </select>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityModal;
