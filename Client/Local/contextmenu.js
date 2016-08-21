const contextMenu = document.getElementById("contextMenu");
contextMenu.pos = {};

c.oncontextmenu = function(e) {
    contextMenu.style.display = "block";
    contextMenu.style.left = Math.min(e.x,c.width - contextMenu.clientWidth);
    contextMenu.style.top = Math.min(e.y,c.height - contextMenu.clientHeight);
    contextMenu.pos = { x: e.x / zoom + offset.x, y: -e.y / zoom + offset.y };

    contextMenu.innerHTML = "";
    if(cursor.selecting) {
        contextMenu.appendChild(context_options["delete all"]);
    } else {
        const component = find(Math.round(e.x / zoom + offset.x),Math.round(-e.y / zoom + offset.y));
        if(component) {
            component.label && contextMenu.appendChild(context_options["edit_label"]);
            contextMenu.appendChild(context_options["rotate"]);
            contextMenu.appendChild(context_options["clone"]);
            contextMenu.appendChild(context_options["delete"]);
        } else {
            contextMenu.appendChild(context_options["paste"]);
        }
    }

    return false;
}

/* Menu options */
const context_options = {};

// Edit label
context_options["edit_label"] = document.createElement("li");
context_options["edit_label"].innerHTML = '<i class="material-icons">mode_edit</i><span>Edit Label [E]</span>';
context_options["edit_label"].onmouseup = () => {
    const component = find(cursor.pos_r.x,cursor.pos_r.y);
    if(component && component.label) {
        const new_label = prompt("Enter the new label name:");
        new_label && (component.label = new_label);
    }
}

// Rotate
context_options["rotate"] = document.createElement("li");
context_options["rotate"].innerHTML = '<i class="material-icons">rotate_left</i><span>Rotate [R]</span>';
context_options["rotate"].onmouseup = () => find(cursor.pos_r.x,cursor.pos_r.y) && find(cursor.pos_r.x,cursor.pos_r.y).rotate();

// Clone
context_options["clone"] = document.createElement("li");
context_options["clone"].innerHTML = '<i class="material-icons">content_copy</i><span>Clone [CTRL+D+Drag]</span>';
context_options["clone"].onmouseup = () => find(cursor.pos_r.x,cursor.pos_r.y) && new (find(cursor.pos_r.x,cursor.pos_r.y).constructor);

// Paste
context_options["paste"] = document.createElement("li");
context_options["paste"].innerHTML = '<i class="material-icons">content_paste</i><span>Paste [CTRL+V]</span>';
context_options["paste"].onmouseup = () => find(cursor.pos_r.x,cursor.pos_r.y) && find(cursor.pos_r.x,cursor.pos_r.y).rotate();

// Delete
context_options["delete"] = document.createElement("li");
context_options["delete"].innerHTML = '<i class="material-icons">delete</i><span>Delete [Del]</span>';
context_options["delete"].onmouseup = () => remove(cursor.pos_r.x,cursor.pos_r.y);

// Delete All
context_options["delete all"] = document.createElement("li");
context_options["delete all"].innerHTML = '<i class="material-icons">delete</i><span>Delete [Del]</span>';
context_options["delete all"].onmouseup = () => remove(cursor.selecting.x,cursor.selecting.y,cursor.selecting.w,cursor.selecting.h);

for(let i in context_options) {
    context_options[i].onclick = function() { this.parentElement.style.display = "none"; cursor.selecting = null }
}


