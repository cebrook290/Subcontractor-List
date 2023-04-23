class Contractor {
    constructor(name) {
        this.name = name;
        this.projects = [];
    }

    addProject(name, cost) {
        this.projects.push(new Project(name, cost));
    }
}

class Project {
    constructor(name, cost) {
        this.name = name;
        this.cost = cost;
    }
}

class ContractorList {
    static url = 'https://643f5df43dee5b763e1b1d3b.mockapi.io/subcontractorList'

    static getAllContractors() {
        return $.get(this.url);
    }

    static getContractor() {
        return $.get(this.url + `${id}`);
    }

    static createContractor(contractor) {
        return $.post(this.url, contractor);
    }

    static updateContractor(contractor) {
        return $.ajax ({
            url: this.url + `/${contractor.id}`,
            dataType: 'json',
            data: JSON.stringify(contractor),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteContractor(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

}

class DOMManager {
    static contractors;

    static getAllContractors() {
        ContractorList.getAllContractors().then(contractors => this.render(contractors));
    }

  

    static render(contractors) {
        this.contractors = contractors;
        $('#app').empty();
        for (let contractor of contractors) {
            $('#app').prepend(
                `<div id='${contractor.id}' class='card'>
                <div class='card-header'>
                    <h2>${contractor.name}</h2>
                    <button class='btn btn-danger' onclick="DOMManager.deleteContractor('${contractor.id}')">Delete</button>
                </div>
                <div class='card-body'>
                    <div class='card'>
                        <div class='row'>
                            <div class='col-sm'>
                                <input type= 'text' id='${contractor.id}-project-name' class='form-control' placeholder='Project Name'>
                            </div>
                            <div class='col-sm'>
                            <input type= 'text' id='${contractor.id}-project-cost' class='form-control' placeholder='Project Cost'>
                            </div>
                        </div>
                        <br>
                        <button id='${contractor.id}-new-room' onclick="DOMManager.addProject('${contractor.id}')" class='btn btn-primary form-control'>Add</button>
                    </div>
                </div>
            </div><br>`
            );
            }
    }
    static render(projects) {
        this.projects = projects;
            for (let project of projects) {
                $('#app').append(
                    $(`#${project.id}`).find('.card-body').append(
                        `<p>
                            <span id="name-${project.id}"><strong>Name: </strong> ${project.name}</span>
                            <span id="cost-${project.id}"><strong>Cost: </strong> ${project.cost}</span>
                            <button class="btn btn-danger" onclick="DOMManager.deleteProject('${project.id}', '${project.id}')">Delete Project</button>`
                        )
                )
            }

        }
        

            
    
}

DOMManager.getAllContractors();

