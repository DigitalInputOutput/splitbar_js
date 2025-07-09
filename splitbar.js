class SplitBar{
    constructor(container){
        this.container = document.getElementById(container);
        this.dragging = null;

        this.addParts();

        this.changePartWidth();
        this.changeDragHandlePosition();
        this.bindDragingEvent();
    }
    addParts(){
        const inputs = document.querySelectorAll('input:checked');

        inputs.forEach((inp) => {
            let parts = this.container.querySelectorAll('.part');
            if(parts.length > 0){
                this.addDragHandle();
            }
            this.container.innerHTML += document.getElementById("part-template").innerHTML;
        });

        this.colorfulParts();
    }
    colorfulParts(){
        let i = 1;
        document.querySelectorAll('.part').forEach((part) => {
            if(!part.className.includes(`part-${i}`))
                part.classList.add(`part-${i}`);
            i++;
        });
    }
    addDragHandle(){
        this.container.innerHTML += document.getElementById("drag-template").innerHTML;
    }
    changePartWidth(){
        let partWidth = 100 / document.querySelectorAll('.part').length;
        document.querySelectorAll('.part').forEach((part) => {
            part.style.width = `${partWidth}%`;
        });
    }
    changeDragHandlePosition(){
        document.querySelectorAll('.drag-handle').forEach((handle) => {
            const container = handle.parentElement;
            const leftPart = handle.previousElementSibling;
            const parts = Array.from(container.querySelectorAll('.part'));

            let offset = 0;

            for (const part of parts) {
                if (part === leftPart) break;
                offset += part.offsetWidth;
            }

            const leftPartWidth = leftPart.offsetWidth;
            const handleWidth = handle.offsetWidth;

            const handleLeft = offset + leftPartWidth - handleWidth / 2;

            handle.style.left = `${handleLeft}px`;
        });
    }
    bindDragingEvent(){
        document.querySelectorAll('.drag-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.dragging = handle;
                e.preventDefault();
            });
        });

        document.addEventListener('mouseup', () => {
            this.dragging = null;
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.dragging) return;

            const rect = this.container.getBoundingClientRect();
            const totalWidth = rect.width;
            const mouseX = e.clientX - rect.left;

            const parts = this.findAdjacentParts(this.dragging);

            let offset = 0;
            let node = parts[0].previousElementSibling;
            while (node) {
                if (node.classList.contains('part')) {
                    offset += node.offsetWidth;
                }
                node = node.previousElementSibling;
            }

            const offsetPercent = (offset / totalWidth) * 100;

            const partsTotal = parseFloat(parts[0].style.width) + parseFloat(parts[1].style.width);

            let rawPercent = (mouseX / totalWidth) * 100;
            let newLeftPercent = Math.max(0, Math.min(partsTotal, rawPercent - offsetPercent));

            parts[0].style.width = newLeftPercent + "%";
            parts[1].style.width = (partsTotal - newLeftPercent) + "%";
            this.dragging.style.left = (offsetPercent + newLeftPercent) + "%";
        });
    }
    findAdjacentParts(handle) {
        let prev = handle.previousElementSibling;
        while (prev && !prev.classList.contains('part')) {
            prev = prev.previousElementSibling;
        }

        let next = handle.nextElementSibling;
        while (next && !next.classList.contains('part')) {
            next = next.nextElementSibling;
        }

        return [prev, next];
    }
}
