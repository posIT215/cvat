// Copyright (C) 2021-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { numberArrayToPoints, pointsToNumberArray, Point } from '../math';

export interface BoxFittingParams {
    shape: {
        shapeType: 'rectangle';
    };
    canvas: {
        shapeType: 'points';
        enableThreshold: boolean;
        onChangeToolsBlockerState: (event:string) => void;
    };
}

export interface BoxFitting {
    kind: string;
    reset(): void;
    run(points: number[], image: ImageData): number[];
    params: BoxFittingParams;
    switchBlockMode(mode?:boolean):void;
}

export default class BoxFittingImplementation implements BoxFitting {
    public kind = 'opencv_box_fitting_tracker';
    private cv: any;
    private onChangeToolsBlockerState: (event: string) => void;
    private box: {
        tool: any;
        state: {
            rectangle: number[];
            image: any | null;
            blocked: boolean;
        };
    };

    public constructor(cv: any, onChangeToolsBlockerState:(event:string) => void) {
        // console.log("box-fitting.ts : " , cv)
        // console.log("box-fitting.ts : " , onChangeToolsBlockerState)
        this.cv = cv;
        this.onChangeToolsBlockerState = onChangeToolsBlockerState;
        this.reset();
    }

    public switchBlockMode(mode:boolean): void {
        this.box.state.blocked = mode;
    }

    public reset(): void {
        this.box = {
            tool: new this.cv.RotatedRect(), // Assuming OpenCV has a RotatedRect tool for fitting
            state: {
                rectangle: [],
                image: null,
            },
        };
    }

    public run(points: number[], image: ImageData): number[] {
        if (!Array.isArray(points) || points.length !== 4) {
            throw new Error('Exactly four coordinates are expected for a rectangle');
        }

        const { cv, box } = this;
        const { tool } = box;
        // console.log(box);
        // console.log(tool);
        let matImage = null;

        try{
            matImage = cv.matFromImageData(image);
        // Implement box fitting logic here using the points
        // and possibly OpenCV functions.
        // The result would be a rotated rectangle (or normal rectangle)
        // that fits the given points.

        // For the sake of example, let's assume the tool gives us a fitted rectangle
        const fittedRectangle = tool.fit(points);

        return fittedRectangle.toArray(); // Convert the rectangle to an array of points.
        } finally{
            matImage.delete();
        }
    }

    public get type(): string {
        return 'opencv_box_fitting_tracker';
    }

    public get params(): BoxFittingParams {
        return {
            shape: {
                shapeType: 'rectangle',
            },
            canvas: {
                shapeType: 'points',
                enableThreshold: true,
                onChangeToolsBlockerState: this.onChangeToolsBlockerState,
            },
        };
    }
}