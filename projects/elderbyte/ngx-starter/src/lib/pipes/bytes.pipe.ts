import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | bytes:precision
 * Example:
 *   {{ 1024 |  bytes}}
 *   formats to: 1 KB
 */
@Pipe({name: 'bytes'})
export class BytesPipe implements PipeTransform {

    private units = [
        'bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];

    transform(bytes = 0, precision = 2): string {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) { return '?'; }

        let unit = 0;

        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }

        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    }

}
