import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import applauseCheer from "/applause_cheer.mp3";
import lightSwitchOff from "/light_switch_off.mp3";
import lightSwitchOn from "/light_switch_on.mp3";

interface SwitcherButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SwitcherButton = forwardRef(
	(
		{ isOpen, setIsOpen }: SwitcherButtonProps,
		ref: React.Ref<HTMLButtonElement>
	) => {
		const switchOnAudio = useRef(new Audio(lightSwitchOn));
		const switchOffAudio = useRef(new Audio(lightSwitchOff));
		const applauseCheerAudio = useRef(new Audio(applauseCheer));
		const buttonRef = useRef<HTMLButtonElement>(null);

		// Forward the internal ref to the parent
		useImperativeHandle(ref, () => buttonRef.current!);

		useEffect(() => {
			const handleWindowClick = (e: MouseEvent) => {
				if (!buttonRef.current) return;

				// Eğer tıklanan element button veya button'un içindeyse, işlem yapma
				if (
					buttonRef.current === e.target ||
					buttonRef.current.contains(e.target as Node)
				) {
					return;
				}

				const { top, left } = buttonRef.current.getBoundingClientRect();
				if (
					e.clientY < top ||
					e.clientY > top + buttonRef.current.offsetHeight ||
					e.clientX < left ||
					e.clientX > left + buttonRef.current.offsetWidth
				) {
					return;
				}

				e.stopPropagation();
				buttonRef.current.click();
			};

			window.addEventListener("click", handleWindowClick);
			return () => {
				window.removeEventListener("click", handleWindowClick);
			};
		}, []);

		const handleClick = () => {
			if (isOpen) {
				applauseCheerAudio.current.pause();
				switchOffAudio.current.play();
			} else {
				applauseCheerAudio.current.play();
				switchOnAudio.current.play();
			}
			setIsOpen((prev) => !prev);
		};

		return (
			<div className='absolute top-0 right-0 flex flex-col items-center gap-3 p-4'>
				<button
					ref={buttonRef}
					onClick={handleClick}
					className='group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2'
				>
					<svg width='67' height='100' viewBox='0 0 200 300'>
						{/* Switch Plate Depth/Side */}
						<path
							d='M 20 10 L 15 15 L 15 285 L 20 290 L 20 10 Z'
							fill='#fff'
							stroke='#000'
							strokeWidth='3'
						/>
						<line
							x1='15'
							y1='15'
							x2='20'
							y2='10'
							stroke='#000'
							strokeWidth='3'
						/>
						<line
							x1='15'
							y1='285'
							x2='20'
							y2='290'
							stroke='#000'
							strokeWidth='3'
						/>

						{/* Main Switch Plate */}
						<rect
							x='20'
							y='10'
							width='160'
							height='280'
							rx='8'
							fill='#fff'
							stroke='#000'
							strokeWidth='4'
						/>

						{/* Corner Screws */}
						<circle
							cx='40'
							cy='30'
							r='6'
							fill='#fff'
							stroke='#000'
							strokeWidth='3'
						/>
						<line
							x1='35'
							y1='30'
							x2='45'
							y2='30'
							stroke='#000'
							strokeWidth='2'
						/>

						<circle
							cx='160'
							cy='30'
							r='6'
							fill='#fff'
							stroke='#000'
							strokeWidth='3'
						/>
						<line
							x1='155'
							y1='30'
							x2='165'
							y2='30'
							stroke='#000'
							strokeWidth='2'
						/>

						<circle
							cx='40'
							cy='270'
							r='6'
							fill='#fff'
							stroke='#000'
							strokeWidth='3'
						/>
						<line
							x1='35'
							y1='270'
							x2='45'
							y2='270'
							stroke='#000'
							strokeWidth='2'
						/>

						<circle
							cx='160'
							cy='270'
							r='6'
							fill='#fff'
							stroke='#000'
							strokeWidth='3'
						/>
						<line
							x1='155'
							y1='270'
							x2='165'
							y2='270'
							stroke='#000'
							strokeWidth='2'
						/>

						{/* ON Text */}
						<text
							x='100'
							y='80'
							textAnchor='middle'
							fontSize='32'
							fontWeight='bold'
							fill='#000'
							fontFamily='Arial, sans-serif'
						>
							ON
						</text>

						{/* Toggle Switch - Animated */}
						<g
							className='transition-all duration-500 ease-out'
							style={{ transformOrigin: "100px 150px" }}
						>
							{/* Switch Base */}
							<rect
								x='70'
								y='140'
								width='60'
								height='80'
								rx='4'
								fill='#fff'
								stroke='#000'
								strokeWidth='4'
							/>

							{/* Toggle Lever - Rotates based on state */}
							<g
								className='transition-all duration-500 ease-out'
								style={{
									transform: isOpen ? "rotate(-35deg)" : "rotate(35deg)",
									transformOrigin: "100px 180px",
								}}
							>
								{/* Lever 3D effect */}
								<path
									d='M 85 120 L 115 120 L 120 125 L 120 185 L 115 190 L 85 190 L 80 185 L 80 125 Z'
									fill='#fff'
									stroke='#000'
									strokeWidth='4'
									strokeLinejoin='round'
								/>

								{/* Lever top face */}
								<rect
									x='85'
									y='120'
									width='30'
									height='70'
									rx='2'
									fill='#fff'
									stroke='#000'
									strokeWidth='4'
								/>

								{/* Lever detail lines */}
								<line
									x1='90'
									y1='135'
									x2='110'
									y2='135'
									stroke='#000'
									strokeWidth='2'
								/>
								<line
									x1='90'
									y1='175'
									x2='110'
									y2='175'
									stroke='#000'
									strokeWidth='2'
								/>
							</g>
						</g>

						{/* OFF Text */}
						<text
							x='100'
							y='255'
							textAnchor='middle'
							fontSize='32'
							fontWeight='bold'
							fill='#000'
							fontFamily='Arial, sans-serif'
						>
							OFF
						</text>
					</svg>
				</button>

				<p className='text-base font-bold text-black'>
					{isOpen ? "ON" : "OFF"}
				</p>
			</div>
		);
	}
);
