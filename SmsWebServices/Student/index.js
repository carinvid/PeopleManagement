$( document ).ready(function() {
    GetStudents();
});

var OpenModal = function(){
    $('#myModal').modal('show');
};

var GetStudents = function () {
    var txtSearch = $('#txtSearch').val();
    $.ajax({
        type:"GET",
        url: "http://localhost:51087/api/Students/GetStudents",
        data: {
            search: txtSearch
        },
        success: function (data) {
            var tmpl = _.template($('#templete').html());
            $('#tblStdBody').html('');
            for (var i = 0; i < data.length; i++) {
                var row = {
                    address: data[i].Address,
                    age: data[i].Age,
                    id: data[i].Id,
                    interests: data[i].Interests,
                    name: data[i].Name,
                    picture: data[i].Picture,
                    color: 'background-color: ' + '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
                };
                $('#tblStdBody').append(tmpl(row));
            }
            
        }
    });
};

var SaveStudent = function () {
    var txtName = $("#txtName").val();
    var txtAddress = $("#txtAddress").val();
    var txtAge = $("#txtAge").val();
    var txtInterests = $("#txtInterests").val();
    var file = $("#fileUpload").get(0).files;
    var formData = new FormData();

    var isValid = true;
    if (txtName === "") {
        $("#txtName").css('border', '1px solid red');
        isValid = false;
    } else {
        $("#txtName").css('border', '1px solid #ccc');
    }

    if (isValid) {
        formData.append("name", txtName);
        formData.append("address", txtAddress);
        formData.append("age", txtAge);
        formData.append("interests", txtInterests);
        formData.append("uploadfile", file[0]);
        $.ajax({
            type: "POST",
            url: "http://localhost:51087/api/Students/SaveStudent",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "JSON",
            success: function (response) {
                if (response === "200") {
                    alert("Saved Successfully.");
                    GetStudents();
                    $('#myModal').modal('hide');
                } else {
                    alert("Error: " + response);
                }
            },
        });
    }
};

var DeleteStudent = function (id) {
    var isConfirm = confirm("Are you sure??");
    if (isConfirm) {
        var formData = new FormData();
        formData.append("id", id);
        $.ajax({
            type: "POST",
            url: "http://localhost:51087/api/Students/DeleteStudent",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "JSON",
            complete: function (response) {
                //alert("Deleted Successfully");
                GetStudents();
            }
        });
    }
}