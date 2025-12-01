/**
 * TeapotControls Component
 * HTML overlay 방식 GUI 컨트롤 패널
 */
import { SHADING_MODE_OPTIONS, TESSELLATION_RANGE } from '../constants';

import type { TeapotConfig, ShadingMode } from '../types';

interface TeapotControlsProps {
    config: TeapotConfig;
    onConfigChange: (config: Partial<TeapotConfig>) => void;
}

export function TeapotControls({ config, onConfigChange }: TeapotControlsProps) {
    const handleTessellationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onConfigChange({ tessellation: Number(e.target.value) });
    };

    const handleShadingModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onConfigChange({ shadingMode: e.target.value as ShadingMode });
    };

    const handleCheckboxChange = (key: keyof TeapotConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onConfigChange({ [key]: e.target.checked });
    };

    return (
        <div className="absolute top-4 right-4 w-64 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4 z-10">
            <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">
                Teapot Controls
            </h3>

            {/* Tessellation */}
            <div className="space-y-1">
                <label htmlFor="tessellation" className="block text-xs font-medium text-gray-600">
                    Tessellation: {config.tessellation}
                </label>
                <input
                    id="tessellation"
                    type="range"
                    min={TESSELLATION_RANGE.min}
                    max={TESSELLATION_RANGE.max}
                    step={TESSELLATION_RANGE.step}
                    value={config.tessellation}
                    onChange={handleTessellationChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Tessellation level"
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>{TESSELLATION_RANGE.min}</span>
                    <span>{TESSELLATION_RANGE.max}</span>
                </div>
            </div>

            {/* Shading Mode */}
            <div className="space-y-1">
                <label htmlFor="shading-mode" className="block text-xs font-medium text-gray-600">
                    Shading Mode
                </label>
                <select
                    id="shading-mode"
                    value={config.shadingMode}
                    onChange={handleShadingModeChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Select shading mode"
                >
                    {SHADING_MODE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display Options */}
            <div className="space-y-2">
                <span className="block text-xs font-medium text-gray-600">Display</span>
                <div className="space-y-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.showLid}
                            onChange={handleCheckboxChange('showLid')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Lid</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.showBody}
                            onChange={handleCheckboxChange('showBody')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Body</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.showBottom}
                            onChange={handleCheckboxChange('showBottom')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Bottom</span>
                    </label>
                </div>
            </div>

            {/* Auto Rotate */}
            <div className="pt-2 border-t">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={config.autoRotate}
                        onChange={handleCheckboxChange('autoRotate')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto Rotate</span>
                </label>
            </div>
        </div>
    );
}
