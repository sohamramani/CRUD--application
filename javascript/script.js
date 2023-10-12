// This is to prevent any jQuery code from running before the document is finished loading (is ready).
$(document).ready( function () {

    // declare row index  variable
    let row_index;

    // declare datatable
    let table = $('#table_id').DataTable({});

    // submit btn for check validation
    $("#submit").on("click", () => {
        if(!$("#form").valid()){
            checkValidation();
        }
        })

    //prevent default validation messages
    $.validator.messages.required = checkValidation();

    // form validation
    function checkValidation() {
        $("form").validate({
            rules: {
                fname: {
                    required: true,
                    lettersonly: true,
                    nowhitespace: true,
                    minlength: 2
                },
                lname: { 
                    required: true,
                    minlength: 2,
                    lettersonly: true,
                    nowhitespace: true
                },
                email: {   
                    required: true,
                    email: true
                },
                Gender: {
                    required: true,
                },
                Country:{
                    required:true
                },
                hobbies: {
                    required : true,
                }
            },  
            messages : {
                fname:{
                required: "Please enter your firstname",
                },
                lname:{
                    required: "Please enter your lastname",
                },
                email: {
                    required: " Please enter your email",
                    email: "The email should be in the format: abc@domain.tld"
                },
                Gender: {
                    required: "please select a gender option.",
                },
                Country:{
                    required: "please select a country"
                },
                hobbies: {
                    required: "You must check at least one checkbox",
                }
            },  

            //errorPlacement of radio and checkbox
            errorPlacement: function(error, element){
                if(element.is(":radio")){
                    error.appendTo(element.parents("#gender"));
                } else if (element.is(":checkbox")){
                    error.appendTo(element.parents("#hobbies"));
                }else{
                    error.insertAfter(element);
                }
            }
        });
    }

    // submit function
    $("#submit").click(function(){
        let id = $("#submit").attr("data-id")
        let fname = $("#fname").val();
        let lname = $("#lname").val();
        let email = $("#email").val();
        let gender = $('input[name="Gender"]:checked').val();
        let country = $('#country').find(":selected").val();
        let hobbies = $('input[name="hobbies"]:checked').map(function(){ return this.value; }).get();
        let btn = '<button type="button" class="delete cancel btn btn-small btn-danger me-2">Delete</button><button type="button" id="edit" class="edit btn btn-small btn-warning">Edit</button>'
        
        // onclick update btn
        if(id == "submit") {
            if (fname !== "" && lname !== "" && email !== "" && gender !== undefined && country !== "" && hobbies.length !== 0 && $("#form").valid() ){
                table.row.add([fname, lname, email, gender, country, hobbies, btn ]).draw();
                resetForm();
            }
        }
        
        // onclick update btn
        if(id == "update") {
            if (fname !== "" && lname !== "" && email !== "" && gender !== undefined && country !== "" && hobbies.length !== 0 && $("#form").valid()){
            table.row(row_index).data([fname, lname, email, gender, country, hobbies, btn ]).draw();
           $(".submit").attr('data-id', 'submit').html("submit").css('background-color','yellow');
           resetForm();
            }
        }
    });

    // resetform
    function resetForm() {
        $("#form").trigger("reset");
        //remove validation
        let removevalid = $("#form").validate();
        removevalid.resetForm();
    }

    //on click delete btn 
    $("#table_id").on('click','.delete',function(){ 
        let delete_row_index  = table.row( $(this).parents().parent()).index();
        table.row(delete_row_index).remove().draw();  
        $(".submit").attr('data-id', 'submit').html("submit").css('background-color','yellow'); 
        resetForm();
    });

    // on click edit btn 
    $("#table_id").on('click','.edit',function(){ 
        let row = table.row($(this).parents().parent()).data()
        $("#fname").val(row[0]);
        $("#lname").val(row[1]);
        $("#email").val(row[2]);
        if (row[3] == "male"){
            $("#male").prop("checked", true);
        }
        if (row[3] == "female"){
            $("#female").prop("checked", true);
        }
        $("#country").val(row[4]);
        $(".hobbies").val(row[5]);
        $(".submit").attr('data-id', 'update').html("update").css('background-color','green');
        row_index  = table.row( $(this).parents().parent()).index();
        if(!$("#form").valid()){
            checkValidation();
        }
    });
});
