'use server'
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();
const tasksRef = db.collection('tasks');

type Task = {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETE';
};

// CREATE
export async function addNewTaskToDatabase(newTask: string) {
  await tasksRef.doc().create({
    title: newTask,
    status: 'IN_PROGRESS',
    createdAt: Date.now(),
  });
  return;
}

// READ
export async function getTasksFromDatabase() {
  const snapshot = await tasksRef.orderBy('createdAt', 'desc').limit(100).get();
  const tasks = await snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    status: doc.data().status,
  }));
  return tasks;
}

// UPDATE
export async function updateTaskInDatabase(task: Task) {
  await tasksRef.doc(task.id).set(task);
  return;
}

// DELETE
export async function deleteTaskFromDatabase(taskId: string) {
  await tasksRef.doc(taskId).delete();
  return;
}