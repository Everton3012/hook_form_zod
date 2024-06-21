"use client";

import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import axios from "axios";

const schemForma = z.object({
  address: z.object({
    zipCode: z.string().min(9, "Por favor, informe um CEP válido"),
    street: z.string().min(1, "Por favor, informe uma Rua válido"),
    district: z.string().min(1, "Por favor, informe um bairro válido"),
    complement: z.string(),
    number: z.string().min(1, "Por favor, informe um número válido"),
    state: z.string().min(1, "Por favor, informe um estado válido"),
    city: z.string().min(9, "Por favor, informe uma cidade válida"),
  }),
}).transform((field) => ({
  address: {
    zipCode: field.address.zipCode,
    street: field.address.street,
    number: field.address.number,
    state: field.address.state,
    city: field.address.city,
    complement: field.address.complement,
    district: field.address.district,
  }
}) );

type FormProps = z.infer<typeof schemForma>;
type AddressProps = {
  bairro: string;
  complemento: string;
  uf: string;
  logradouro: string;
  localidade: string;
}

export const Form = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormProps>({
    criteriaMode: 'all',
    resolver: zodResolver(schemForma),
    defaultValues: {
      address: {
        zipCode: "",
        city: "",
        state: "",
        street: "",
        complement: "",
        district: "",
        number: "",
      },
    },
  });

  const zipCode = watch('address.zipCode');

  const handleSetData = useCallback((data: AddressProps) => {
    setValue('address.city', data.localidade)
    setValue('address.street', data.logradouro)
    setValue('address.state', data.uf)
    setValue('address.district', data.bairro)
    setValue('address.complement', data.complemento)
  }, [setValue])

  const handleFormSubmit = (data: FormProps) => {
    console.log(data);
  };

  const handleFetchAddres = useCallback(async (zipCode : string) => {
    const {data } = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`)

  handleSetData(data);
    
  },[handleSetData]);

  useEffect(() => {
    if(zipCode.length != 9) return;

    handleFetchAddres(zipCode);
  },[handleFetchAddres, zipCode])


  return (
    <div>
      <main className={styles.cep}>
        <h2>Cep</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <input
            type="text"
            {...register("address.zipCode")}
            placeholder="CEP"
            maxLength={9}
          />
          {errors.address?.zipCode?.message && (
            <p>{errors.address?.zipCode?.message}</p>
          )}
          <input
            type="text"
            {...register("address.street")}
            placeholder="Rua"
          />
          {errors.address?.state?.message && (
            <p>{errors.address?.street?.message}</p>
          )}

          <input
            type="text"
            {...register("address.district")}
            placeholder="Bairro"
          />
          {errors.address?.district?.message && (
            <p>{errors.address?.district?.message}</p>
          )}

          <input
            type="text"
            {...register("address.complement")}
            placeholder="Complemento"
          />
          {errors.address?.complement?.message && (
            <p>{errors.address?.complement?.message}</p>
          )}
          <input
            type="text"
            {...register("address.number")}
            placeholder="numero"
          />
          {errors.address?.zipCode?.message && (
            <p>{errors.address?.zipCode?.message}</p>
          )}

          <input
            type="text"
            {...register("address.city")}
            placeholder="Cidade"
          />
          {errors.address?.city?.message && (
            <p>{errors.address?.city?.message}</p>
          )}
          <input
            type="text"
            {...register("address.state")}
            placeholder="Estato"
          />
          {errors.address?.state?.message && (
            <p>{errors.address?.state?.message}</p>
          )}
          <button type="submit">Enviar</button>
        </form>
      </main>
    </div>
  );
};
