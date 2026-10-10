"""Generate static SVG geometry from Natural Earth public-domain GeoJSON.

Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
110m Admin 0 countries for the world; 50m Admin 0 countries for Indonesia detail.
The SVGs are checked in, so the site needs no map service or build-time network.
"""
import json
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1] / 'public' / 'maps'
ROOT.mkdir(parents=True, exist_ok=True)


def load(scale):
    url = f'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_{scale}_admin_0_countries.geojson'
    with urlopen(url, timeout=30) as response:
        return json.load(response)['features']


def rings(geometry):
    if geometry['type'] == 'Polygon':
        return geometry['coordinates']
    return [ring for polygon in geometry['coordinates'] for ring in polygon]


def path(geometry, project):
    segments = []
    for ring in rings(geometry):
        points = [project(lon, lat) for lon, lat in ring]
        if points:
            segments.append('M' + ' '.join(f'{x:.2f},{y:.2f}' if i == 0 else f'L{x:.2f},{y:.2f}' for i, (x, y) in enumerate(points)) + 'Z')
    return ''.join(segments)


def svg(features, project, width, height, region=False):
    base, selected = [], []
    for feature in features:
        name = feature['properties'].get('ADMIN')
        if region:
            points = [p for ring in rings(feature['geometry']) for p in ring]
            if not points or max(p[0] for p in points) < 92 or min(p[0] for p in points) > 122 or max(p[1] for p in points) < -11 or min(p[1] for p in points) > 7:
                continue
        d = path(feature['geometry'], project)
        if name == 'Indonesia':
            selected.append(f'<path class="indonesia" d="{d}"/>')
        elif name == 'Germany' and not region:
            selected.append(f'<path class="germany" d="{d}"/>')
        else:
            base.append(f'<path d="{d}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="Natural Earth country boundaries">'
            '<style>path{fill:#e9e3dd;stroke:#fff;stroke-width:.52;vector-effect:non-scaling-stroke;stroke-linejoin:round}'
            '.indonesia{fill:#c8a15a;stroke:#ad8645;stroke-width:.75}'
            '.germany{fill:#4a0e0e;stroke:#4a0e0e;stroke-width:.75}</style>'
            + ''.join(base + selected) + '</svg>')

world = svg(load('110m'), lambda lon, lat: ((lon + 180) * 1000 / 360, (90 - lat) * 500 / 180), 1000, 500)
region = svg(load('50m'), lambda lon, lat: ((lon - 92) * 20, (7 - lat) * 20), 600, 360, True)
(ROOT / 'world-presence.svg').write_text(world)
(ROOT / 'indonesia-journey.svg').write_text(region)
print('wrote', len(world), 'world SVG and', len(region), 'Indonesia SVG')
