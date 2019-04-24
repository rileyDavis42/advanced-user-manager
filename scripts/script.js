function deleteUser(elem) {
    if (confirm("Delete user?")) {
        elem.parentElement.setAttribute('action', '/deleteUser');
        elem.parentElement.submit();
    }
}

function editUser(elem) {
    elem.parentElement.setAttribute('action', '/editUser');
    elem.parentElement.submit();
}

