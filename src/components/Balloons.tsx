import { useEffect, useState } from "react";

interface BalloonsProps {
	count: number;
}

interface Balloon {
	id: number;
	left: number;
	delay: number;
	duration: number;
	swingDuration: number;
	color: string;
}

const colors = [
	"#FF6B6B", // Red
	"#4ECDC4", // Teal
	"#FFE66D", // Yellow
	"#95E1D3", // Mint
	"#FF85A2", // Pink
	"#A8E6CF", // Light Green
	"#FFD3B6", // Peach
	"#B4A7D6", // Purple
];

export function Balloons({ count }: BalloonsProps) {
	const [balloons, setBalloons] = useState<Balloon[]>([]);

	useEffect(() => {
		const newBalloons: Balloon[] = [];
		for (let i = 0; i < count; i++) {
			newBalloons.push({
				id: i,
				left: Math.random() * 100, // 0-100% rastgele pozisyon
				delay: 1 + Math.random() * 1, // 1-2 saniye başlangıç gecikmesi
				duration: 10 + Math.random() * 10, // 10-20s arası rastgele yükselme süresi
				swingDuration: 1 + Math.random() * 1, // 1-2s arası sallanma süresi
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}
		setBalloons(newBalloons);
	}, [count]);

	return (
		<div className='absolute inset-0 overflow-hidden pointer-events-none'>
			{balloons.map((balloon) => (
				<div
					key={balloon.id}
					className='absolute'
					style={{
						left: `${balloon.left}%`,
						bottom: "-120px",
						animation: `float ${balloon.duration}s ease-in ${balloon.delay}s infinite`,
					}}
				>
					<div
						style={{
							animation: `swing ${balloon.swingDuration}s ease-in-out infinite`,
						}}
					>
						<img
							src='/valentines-balloon.svg'
							alt='Balloon'
							className='size-16 lg:size-20 z-0'
						/>
					</div>
				</div>
			))}
		</div>
	);
}
