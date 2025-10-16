import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";
import { Balloons } from "./components/Balloons";
import { SwitcherButton } from "./components/SwitcherButton";

function App() {
	const overlayRef = useRef<HTMLDivElement>(null);
	const pointerRef = useRef<HTMLImageElement>(null);
	const switchButtonRef = useRef<HTMLButtonElement>(null);

	const [isOpen, setIsOpen] = useState(false);

	const calculateAngle = (
		targetRef: React.RefObject<HTMLElement | null>,
		pointerRef: React.RefObject<HTMLElement | null>
	) => {
		if (!pointerRef.current || !targetRef.current) return 0;

		const pointerRect = pointerRef.current.getBoundingClientRect();
		const targetRect = targetRef.current.getBoundingClientRect();

		// Her iki nesnenin merkez noktalarını hesapla
		const pointerCenterX = pointerRect.left + pointerRect.width / 2;
		const pointerCenterY = pointerRect.top + pointerRect.height / 2;
		const targetCenterX = targetRect.left + targetRect.width / 2;
		const targetCenterY = targetRect.top + targetRect.height / 2;

		// İki nokta arasındaki farkları hesapla
		const dx = targetCenterX - pointerCenterX;
		const dy = targetCenterY - pointerCenterY;

		// atan2 ile açıyı hesapla (radyan cinsinden)
		const angleInRadians = Math.atan2(dy, dx);

		// Radyanı dereceye çevir ve pointer'ın default yukarı pozisyonu için 90° ekle
		const angleInDegrees = angleInRadians * (180 / Math.PI) + 90;

		return angleInDegrees;
	};

	// Pointer effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!pointerRef.current || isOpen || !switchButtonRef.current) return;
			pointerRef.current.style.top = `${e.clientY - 50}px`;
			pointerRef.current.style.left = `${e.clientX - 50}px`;
			const rotateDegree = calculateAngle(switchButtonRef, pointerRef);
			pointerRef.current.style.transform = `rotate(${rotateDegree}deg)`;
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [isOpen]);

	// Light bulb effect
	useEffect(() => {
		if (!overlayRef.current) return;
		let interval: number | undefined;
		if (isOpen) {
			// Ampul açık - ampulden çıkan ışık efekti
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;

			// Ampulden başlayıp tüm ekranı kaplayan geniş bir ışık
			overlayRef.current.style.background = `radial-gradient(
				ellipse at ${centerX}px ${centerY}px,
				rgba(255, 230, 150, 0.4) 0px,
				rgba(255, 200, 100, 0.3) 100px,
				rgba(200, 150, 80, 0.5) 400px,
				rgba(100, 70, 40, 0.65) 800px,
				rgba(0, 0, 0, 0.75) 1200px
			)`;

			// Confetti effect
			const duration = 5 * 1000;
			const animationEnd = Date.now() + duration;
			const defaults = {
				startVelocity: 30,
				spread: 360,
				ticks: 60,
				zIndex: -1,
				scalar: 2,
				colors: ["#FFFFFF", "#000000"],
			};
			const randomInRange = (min: number, max: number) =>
				Math.random() * (max - min) + min;
			interval = window.setInterval(() => {
				const timeLeft = animationEnd - Date.now();
				if (timeLeft <= 0) {
					return clearInterval(interval);
				}
				const particleCount = 50 * (timeLeft / duration);
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
				});
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
				});
			}, 250);
		} else {
			// Ampul kapalı - tamamen karanlık
			overlayRef.current.style.background = "rgba(0, 0, 0, 0.95)";
			// Confetti'yi hemen durdur
			confetti.reset();
		}
		// Cleanup: component unmount veya isOpen değiştiğinde interval'ı temizle
		return () => {
			if (interval) {
				clearInterval(interval);
			}
			confetti.reset(); // Component unmount'ta da temizle
		};
	}, [isOpen]);

	// Background cursor effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (overlayRef.current && !isOpen) {
				overlayRef.current.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 0px, transparent 80px, rgba(0,0,0,1) 150px)`;
			}
		};
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [isOpen]);

	return (
		<>
			<div className='md:hidden absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-2xl font-bold'>
				Not Supported on Small Screens
			</div>
			<div className='hidden md:flex relative h-screen w-screen items-center justify-center overflow-hidden'>
				{/* Birthday text */}
				<img
					src='/banner.png'
					alt='Birthday Banner'
					className='absolute top-0 left-10 -rotate-12 size-80 lg:size-100 object-contain'
				/>
				<img
					src='/banner.png'
					alt='Birthday Banner'
					className='absolute top-0 right-10 rotate-12 size-80 lg:size-100 object-contain'
				/>
				<img
					src='/banner.png'
					alt='Birthday Banner'
					className='absolute top-0 left-1/2 -translate-x-1/2 size-40 lg:size-60 object-contain'
				/>

				{/* Pointer to point where the light is */}
				<img
					ref={pointerRef}
					src='/finger_pointer.svg'
					alt='pointer'
					className={`z-10 size-20 absolute top-0 left-0 ${
						isOpen ? "hidden" : "block"
					}`}
				/>

				<audio src='/audio.mp3' />
				<SwitcherButton
					ref={switchButtonRef}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					className='justify-self-end text-2xl absolute top-0 right-0 z-10'
				/>

				{/* Background content */}
				<img
					src='/kitty.gif'
					alt='Kitty'
					className='absolute bottom-10 left-12 size-40 lg:size-60 object-contain'
				/>

				<img
					src='couple.gif'
					alt='Couple'
					className='absolute bottom-10 right-8 lg:right-12 size-80 lg:size-100 object-contain'
				/>

				{/* Interactive Blow Cake */}
				<img
					src='/suprise.gif'
					alt='Surprise'
					className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-80 lg:size-100 object-contain'
				/>

				{/* Dark overlay with spotlight effect */}
				<div
					ref={overlayRef}
					className='absolute inset-0 pointer-events-none transition-all duration-75'
					style={{
						background:
							"radial-gradient(circle at 50% 50%, transparent 0px, transparent 80px, rgba(0,0,0,1) 150px)",
					}}
				/>

				{/* Balloons */}
				{isOpen && <Balloons count={26} />}
			</div>
		</>
	);
}

export default App;
