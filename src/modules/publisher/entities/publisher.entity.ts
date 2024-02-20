import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'Publisher',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class Publisher extends Model<Publisher> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
      })
      _id: string;
    
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      name: string;

      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      year_founded: string;

      @Column({
        type: DataType.STRING,
        allowNull: true,
      })
      website: string;

      @Column({
        type: DataType.STRING,
        allowNull: true,
      })
      contact: string;

      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      email: string;
    
      @Default(DataType.NOW)
      @Column
      createdAt: Date;
    
      @Default(DataType.NOW)
      @Column
      updatedAt: Date;
}
