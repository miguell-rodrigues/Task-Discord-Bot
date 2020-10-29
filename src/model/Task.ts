export default class Task {
  id: number;

  name: string;

  description: string;

  deliveryTime: string;

  files: [
    {
      id: number;
      url: string;
    },
  ];

  constructor(
    id: number,
    name: string,
    description: string,
    deliveryTime: string,
    files: [{ id: number; url: string }],
    past: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.deliveryTime = deliveryTime;
    this.files = files;
  }
}
