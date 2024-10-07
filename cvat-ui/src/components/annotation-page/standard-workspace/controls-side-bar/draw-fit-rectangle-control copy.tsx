// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Popover from 'antd/lib/popover';
import Icon from '@ant-design/icons';

import { Canvas } from 'cvat-canvas-wrapper';
import { ZoomIcon } from 'icons';
import { RectangleIcon } from 'icons';
import { ShapeType } from 'reducers';
import { ActiveControl } from 'reducers';
import CVATTooltip from 'components/common/cvat-tooltip';

import DrawShapePopoverContainer from 'containers/annotation-page/standard-workspace/controls-side-bar/draw-shape-popover';
import withVisibilityHandling from './handle-popover-visibility';
import openCVWrapper from 'utils/opencv-wrapper/opencv-wrapper';

export interface Props {
    canvasInstance: Canvas;
    isDrawing: boolean;
    disabled?: boolean;
    activeControl: ActiveControl;
    autoFiting : boolean;
}

const getCanvasImageData = ():ImageData => {
    const canvas: HTMLCanvasElement | null = window.document.getElementById('cvat_canvas_background') as
    | HTMLCanvasElement
    | null;
    if (!canvas) {
        throw new Error('Element #cvat_canvas_background was not found');
    }
    const { width, height } = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Canvas context is empty');
    }
    return context.getImageData(0, 0, width, height);
};

const CustomPopover = withVisibilityHandling(Popover, 'draw-rectangle');
function DrawFitRectangleControl(props: Props): JSX.Element {
    const { canvasInstance, isDrawing, disabled,activeControl,autoFiting } = props;

    var cv = openCVWrapper.contours.getcCv();

    console.log(cv);

    const dynamicPopoverProps = isDrawing ? {
        overlayStyle: {
            display: 'none',
        },
    } : {};

    const dynamicIconProps = isDrawing ? {
        className: 'cvat-draw-rectangle-control cvat-active-canvas-control',
        onClick: (): void => {
            canvasInstance.draw({ enabled: false });
        },
    } : {
        className: 'cvat-draw-rectangle-control',
    };

/*     return (
        <CVATTooltip title='Select a region of interest' placement='right'>
            <Icon
                component={ZoomIcon}
                className={
                    activeControl === ActiveControl.ZOOM_CANVAS ?
                        'cvat-resize-control cvat-active-canvas-control' :
                        'cvat-resize-control'
                }
                onClick={(): void => {
                    console.log('dynamicPopoverProps : ', dynamicPopoverProps);
                    console.log('CustomPopover : ', CustomPopover);
                    console.log('DrawShapePopoverContainer : ', DrawShapePopoverContainer);
                }}
            />
        </CVATTooltip>
    ); */

    return disabled ? (
        <Icon className='cvat-draw-rectangle-control cvat-disabled-canvas-control' component={RectangleIcon} />
    ) : (
        <CustomPopover
            {...dynamicPopoverProps}
            overlayClassName='cvat-draw-shape-popover'
            placement='right'
            content={<DrawShapePopoverContainer shapeType={ShapeType.RECTANGLE} autoFiting={autoFiting} ImageData={getCanvasImageData()>}
        >
            <Icon {...dynamicIconProps} component={RectangleIcon} />
        </CustomPopover>
    );
}

export default React.memo(DrawFitRectangleControl);
