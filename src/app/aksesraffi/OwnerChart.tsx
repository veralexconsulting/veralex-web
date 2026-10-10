'use client';

type Point = { label: string; value: number };

const WIDTH = 720;
const HEIGHT = 220;
const PAD = 8;

const points = (data: Point[]) => {
    const max = Math.max(1, ...data.map(item => item.value));
    const step = data.length > 1 ? (WIDTH - PAD * 2) / (data.length - 1) : 0;
    return data.map((item, index) => ({
        x: PAD + step * index,
        y: HEIGHT - PAD - (item.value / max) * (HEIGHT - PAD * 2),
        value: item.value,
    }));
};

export function LineChart({ data, label }: { data: Point[]; label: string }) {
    const shape = points(data);
    const line = shape.map(point => `${point.x},${point.y}`).join(' ');
    const area = `${PAD},${HEIGHT - PAD} ${line} ${shape.at(-1)?.x ?? 0},${HEIGHT - PAD}`;
    const peak = Math.max(1, ...data.map(item => item.value));

    return (
        <figure className="owner-chart">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={`${label}. Puncak ${peak}.`}>
                <polygon points={area} fill="rgba(200,161,90,0.16)" />
                <polyline points={line} fill="none" stroke="#C8A15A" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                {shape.map(point => <circle key={point.x} cx={point.x} cy={point.y} r="2.5" fill="#4A0E0E" />)}
            </svg>
            <figcaption><span>{data[0]?.label ?? ''}</span><span>{data.at(-1)?.label ?? ''}</span></figcaption>
        </figure>
    );
}

export function BarChart({ data, label }: { data: Point[]; label: string }) {
    const max = Math.max(1, ...data.map(item => item.value));
    const width = data.length ? (WIDTH - PAD) / data.length : WIDTH;

    return (
        <figure className="owner-chart">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={`${label}. Puncak ${max}.`}>
                {data.map((item, index) => {
                    const bar = (item.value / max) * (HEIGHT - PAD * 2);
                    return <rect key={item.label} x={PAD / 2 + width * index} y={HEIGHT - PAD - bar} width={Math.max(2, width - 8)} height={bar} rx="4" fill="#4A0E0E" />;
                })}
            </svg>
            <figcaption className="owner-chart-labels">{data.map(item => <span key={item.label} title={`${item.label}: ${item.value}`}>{item.label}</span>)}</figcaption>
        </figure>
    );
}

export function SkeletonChart() {
    return <div className="owner-skeleton owner-skeleton-chart" aria-hidden="true" />;
}
