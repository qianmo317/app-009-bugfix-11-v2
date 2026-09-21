import { useState } from 'react';
import { useChartStore } from '../store/chartStore';

export default function PalettePanel() {
  const chart = useChartStore((s) => s.getCurrentChart());
  const updateChart = useChartStore((s) => s.updateChart);
  const selectedColorIndex = useChartStore((s) => s.selectedColorIndex);
  const setSelectedColorIndex = useChartStore((s) => s.setSelectedColorIndex);
  const [newColor, setNewColor] = useState('#3498db');
  const [newName, setNewName] = useState('');

  if (!chart) return null;

  const addColor = () => {
    const name = newName.trim() || `颜色 ${chart.palette.length + 1}`;
    updateChart(chart.id, (c) => ({
      ...c,
      palette: [...c.palette, { id: Math.random().toString(36).slice(2), name, hex: newColor }],
    }));
    setNewName('');
  };

  const removeColor = (index: number) => {
    if (chart.palette.length <= 1) return;
    updateChart(chart.id, (c) => {
      const palette = c.palette.filter((_, i) => i !== index);
      const newCells = new Uint16Array(c.cells);
      const last = palette.length - 1;
      for (let i = 0; i < newCells.length; i++) {
        if (newCells[i] > last) newCells[i] = last;
      }
      return { ...c, palette, cells: newCells };
    });
    if (selectedColorIndex >= chart.palette.length) {
      setSelectedColorIndex(0);
    }
  };

  const moveColor = (index: number, dir: number) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= chart.palette.length) return;
    updateChart(chart.id, (c) => {
      const palette = [...c.palette];
      [palette[index], palette[newIndex]] = [palette[newIndex], palette[index]];
      const newCells = new Uint16Array(c.cells);
      return { ...c, palette, cells: newCells };
    });
    if (selectedColorIndex === index) setSelectedColorIndex(newIndex);
    else if (selectedColorIndex === newIndex) setSelectedColorIndex(index);
  };

  return (
    <div style={{ padding: 12, borderBottom: '1px solid #e0dcd5' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>调色板</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflow: 'auto' }}>
        {chart.palette.map((p, i) => (
          <div
            key={p.id}
            onClick={() => setSelectedColorIndex(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 6px',
              borderRadius: 4,
              border: selectedColorIndex === i ? '2px solid #3498db' : '1px solid transparent',
              background: selectedColorIndex === i ? '#eef6fc' : '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 4, background: p.hex, border: '1px solid #ddd' }} />
            <span style={{ flex: 1, fontSize: 12 }}>{i + 1}. {p.name}</span>
            <button onClick={(e) => { e.stopPropagation(); moveColor(i, -1); }} style={{ fontSize: 10, padding: '0 4px' }}>↑</button>
            <button onClick={(e) => { e.stopPropagation(); moveColor(i, 1); }} style={{ fontSize: 10, padding: '0 4px' }}>↓</button>
            <button onClick={(e) => { e.stopPropagation(); removeColor(i); }} style={{ fontSize: 10, padding: '0 4px', color: '#c0392b' }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} style={{ width: 32, height: 28, padding: 0, border: 'none' }} />
        <input
          type="text"
          placeholder="颜色名"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1, fontSize: 12, padding: '4px 6px', border: '1px solid #ddd', borderRadius: 4 }}
        />
        <button onClick={addColor} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4, border: '1px solid #3498db', background: '#3498db', color: '#fff', cursor: 'pointer' }}>
          添加
        </button>
      </div>
    </div>
  );
}
