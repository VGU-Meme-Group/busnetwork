const { Validator, minimumDistance, retrieveShape, arrivedCheck } = require('./Validator');

describe('Test Validator function', () => {
    test('Validator should return correct output', () => {
        const array = [{
            segments: [
                {
                    stop_src: { stop_lat: 1, stop_lon: 1 },
                    stop_dest: { stop_lat: 2, stop_lon: 2 },
                    segmentId: 'segment1'
                },
                {
                    stop_src: { stop_lat: 3, stop_lon: 3 },
                    stop_dest: { stop_lat: 4, stop_lon: 4 },
                    segmentId: 'segment2'
                }
            ],
            shapeId: 'shape1'
        }];
        const point = [[1], [1]];
        const minArr = [];
        const output = Validator(array, point, minArr);
        expect(output).toEqual(undefined); // adjust this based on your function's expected output
    });
});

describe('Test minimumDistance function', () => {
    test('minimumDistance should return correct output', () => {
        const array = [{ distance: 1 }, { distance: 2 }, { distance: 3 }];
        const min = Infinity;
        const output = minimumDistance(array, min);
        expect(output).toEqual(1);
    });
});

describe('Test retrieveShape function', () => {
    test('retrieveShape should return correct output', () => {
        const array = [{ distance: 1, shapeId: 'shape1' }, { distance: 2, shapeId: 'shape2' }, { distance: 3, shapeId: 'shape3' }];
        const min = 1;
        const output = retrieveShape(array, min);
        expect(output).toEqual({ distance: 1, shapeId: 'shape1' });
    });
});

describe('Test arrivedCheck function', () => {
    test('arrivedCheck should return correct output', () => {
        const stop1 = { stop_lat: 1, stop_lon: 1 };
        const stop2 = { stop_lat: 2, stop_lon: 2 };
        const lookup = [[1], [1]];
        const output = arrivedCheck(stop1, stop2, lookup);
        expect(output).toEqual(1);
    });
});

