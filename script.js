class Contractor {
    constructor(name) {
        this.name = name;
        this.projects = [];
    }

    addProject(name, cost) {
        this.porjects.push(new Project(name, cost));
    }
}

class Project {
    constructor (name, cost) {
        this.name = name;
        this.cost = cost;
    }
}

class ContractorService {
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
        ContractorService.getAllContractors().then(contractors => this.render(contractors));
    }

    static createContractor(name) {
        ContractorService.createContractor(new Contractor(name))
        .then(() => {
            return ContractorService.getAllContractors();
        })
        .then((contractors) => this.render(contractors));
    }

    static deleteContractor(id) {
        ContractorService.deleteContractor(id)
        .then(() => {
            return ContractorService.getAllContractors();
        })
        .then((contractors) => this.render(contractors));
    }

    static addProject(id) {
        for (let contractor of this.contractors) {
            if (contractor.id == id) {
                contractor.projects.push(new Project($(`#${contractor.id}-project-name`).val(), $(`#${contractor.id}-project-cost`).val()));
                ContractorService.updateContractor(contractor)
                    .then(() => {
                        return ContractorService.getAllContractors();
                    })
                    .then((contractor) => this.render(contractor));
            }
        }
    }

    static deleteProject(contractorId, projectId) {
        for (let contractor of this.contractors) {
            if(contractor.id == contractorId) {
                for (let project of contractor.projects) {
                    if (project.id == projectId) {
                        contractor.projects.splice(contractor.projects.indexOf(project), 1);
                        ContractorService.updateContractor(contractor)
                        .then(() => {
                            return ContractorService.getAllcontractors();
                        })
                        .then((contractors) => this.render(contractors));
                    }
                }
            }
        }
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
                                    <input type= 'text' id='${contractor.id}-project-name' class='form-control' placeholder='Project'>
                                </div>
                                <div class='col-sm'>
                                <input type= 'text' id='${contractor.id}-total-cost' class='form-control' placeholder='Cost'>
                                </div>
                            </div>
                            <br>
                            <button id='${contractor.id}-new-contractor' onClick="DOMManager.addProject('${contractor.id}')" class='btn btn-primary form-control'>Adsd</button>
                        </div>
                    </div>
                </div><br>`                
            );
            for (let project of contractor.projects) {
                $(`#${contractor.id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${project.id}"><strong>Name: </strong> ${project.name}</span>
                        <span id="cost-${project.id}"><strong>Cost: </strong> ${project.cost}</span>
                        <button class="btn btn-danger float-right" onclick="DOMManager.deleteProject('${contractor.id}', '${project.id}')">Delete Project</button>`
                )
            }
        }
    }
}

$('#create-new-contractor').click(() => {
    DOMManager.createContractor($('#new-contractor').val());
    $('#new-contractor').val('');
})

DOMManager.getAllContractors();



