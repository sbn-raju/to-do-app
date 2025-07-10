from flask import Flask, request, render_template, jsonify
import uuid
from flask_cors import CORS

#Creating the instance of the flask.
app = Flask(__name__)


#applying the cors here as well.
CORS(app)


#sample in-memory for the basics projects.
task = []

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/api/v1.to-do-list/task/add', methods=['POST'])
def addTaks():
    taskGot = request.json
    task.append(taskGot)
    return jsonify(task), 201


@app.route('/api/v1.to-do-list/task/read', methods=['GET'])
def getTasks():
    print(task)
    return jsonify(task), 200


@app.route('/api/v1.to-do-list/task/delete/<id>', methods=['DELETE'])
def deleteTasks(id):
    for t in task:
        print(t['id'])
        if t['id'] == id:
            task.remove(t)
        else:
            return jsonify({'error' : 'Task not found'}), 404
    return jsonify({'success' : "true"}) , 200


@app.route('/api/v1.to-do-list/task/update/<id>', methods=['PUT'])
def updateTask(id):
    updateddata = request.json
    print(updateddata)
    for t in task:
        print(t['id'])
        if t['id'] == id:
            t['text'] = updateddata.get('text', t['text'])
            return jsonify({'success': True}), 200
    return jsonify({'success' : "true"}) , 200

if __name__ == '__main__':
    app.run(debug=True)